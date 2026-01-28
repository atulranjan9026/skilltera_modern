# Quick Reference Guide

## Common Tasks

### 1. **Add a New Page**

Create file in `src/features/{feature}/pages/{PageName}.jsx`:

```jsx
import React from 'react';

export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
    </div>
  );
}
```

Then add to appropriate route file (`candidateRoutes.jsx`, `companyRoutes.jsx`, etc.):

```jsx
{
  path: 'my-page',
  element: <MyPage />,
},
```

---

### 2. **Add a New Service**

Create file in `src/services/{serviceName}.js`:

```jsx
import { api } from './api';

export const myService = {
  getItem: async (id) => api.get(`/items/${id}`),
  createItem: async (data) => api.post('/items', data),
  updateItem: async (id, data) => api.put(`/items/${id}`, data),
  deleteItem: async (id) => api.delete(`/items/${id}`),
};
```

---

### 3. **Add a New Custom Hook**

Create file in `src/hooks/{hookName}.js` or `src/features/{feature}/hooks/{hookName}.js`:

```jsx
import { useState } from 'react';
import { myService } from '../services/myService';

export const useMyHook = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const result = await myService.getItem();
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetch };
};
```

---

### 4. **Use Authentication**

In any component:

```jsx
import { useAuthContext } from '@/store/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return <div>Welcome, {user?.name}</div>;
}
```

---

### 5. **Check User Role**

```jsx
import { useUserRole } from '@/hooks/useUserRole';

function MyComponent() {
  const { role, isCandidate, isCompany, isAdmin } = useUserRole();

  return (
    <div>
      {isCandidate && <CandidateContent />}
      {isCompany && <CompanyContent />}
      {isAdmin && <AdminContent />}
    </div>
  );
}
```

---

### 6. **Make API Calls**

```jsx
import { useApi } from '@/hooks/useApi';
import { candidateService } from '@/services/candidateService';

function MyComponent() {
  const { data, isLoading, error, execute } = useApi(candidateService.getProfile);

  useEffect(() => {
    execute(userId);
  }, [userId, execute]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{data?.name}</div>;
}
```

---

### 7. **Access Constants**

```jsx
import { ROUTES, USER_ROLES, JOB_STATUS } from '@/utils/constants';

// Navigate to route
navigate(ROUTES.CANDIDATE.DASHBOARD);

// Check role
if (userRole === USER_ROLES.CANDIDATE) { ... }

// Check status
if (job.status === JOB_STATUS.OPEN) { ... }
```

---

### 8. **Create a Protected Route**

In `src/router/candidateRoutes.jsx`:

```jsx
// This route requires authentication
{
  path: 'protected-page',
  element: <ProtectedComponent />, // Wrap with auth check inside
}
```

In component:

```jsx
import { useAuthContext } from '@/store/context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedComponent() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return <div>Protected Content</div>;
}
```

---

### 9. **Update Global State**

```jsx
import { useUserContext } from '@/store/context/UserContext';

function MyComponent() {
  const { profile, updateProfile } = useUserContext();

  const handleUpdate = (newData) => {
    updateProfile(newData);
  };

  return <div>Profile: {profile?.name}</div>;
}
```

---

### 10. **Add Validation**

```jsx
import { validators } from '@/utils/validators';

const email = 'test@example.com';
if (!validators.email(email)) {
  console.error('Invalid email');
}

const password = 'MyPassword123';
if (!validators.password(password)) {
  console.error('Weak password');
}
```

---

## File Naming Conventions

- **Pages**: `PascalCase` - `MyPage.jsx`
- **Components**: `PascalCase` - `MyComponent.jsx`
- **Hooks**: `camelCase` - `useMyHook.js`
- **Services**: `camelCase` - `myService.js`
- **Utils**: `camelCase` - `helpers.js`, `validators.js`
- **Context**: `PascalCase` - `MyContext.jsx`

---

## Import Path Tips

Always use relative paths from `src` root for clarity:

```jsx
// ✅ Good
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { ROUTES } from '@/utils/constants';

// ❌ Avoid
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../../services/api';
```

Note: This requires a `vite.config.js` alias setup (if not already configured).

---

## Common Patterns

### Loading State
```jsx
const [isLoading, setIsLoading] = useState(false);

const fetch = async () => {
  setIsLoading(true);
  try {
    const data = await service.fetch();
    return data;
  } finally {
    setIsLoading(false);
  }
};
```

### Error Handling
```jsx
const [error, setError] = useState(null);

try {
  await service.operation();
} catch (err) {
  setError(err.message);
}

if (error) return <div className="text-red-600">{error}</div>;
```

### Debounced Search
```jsx
import { debounce } from '@/utils/helpers';

const handleSearch = debounce((query) => {
  // API call
}, 300);
```

---

## Troubleshooting

**Q: Getting "Module not found" error?**
- Check file path is correct
- Ensure file extension is included (`.jsx`, `.js`)
- Verify `vite.config.js` has correct aliases configured

**Q: Context hook throwing error?**
- Ensure component is wrapped with Provider
- Check spelling of hook name
- Verify you're using the correct context

**Q: API call not working?**
- Check API endpoint in service
- Verify `api.js` base URL is correct
- Check network tab in DevTools
