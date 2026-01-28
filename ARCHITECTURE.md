# Skilltera - Modern Architecture Documentation

## 📁 Project Structure Overview

This document describes the scalable, feature-based architecture of the Skilltera application.

```
src/
├── components/              # Shared/reusable components
│   ├── ui/                 # Atomic UI components (Button, Input, Card, etc.)
│   ├── forms/              # Reusable form components
│   ├── common/             # Common components (Header, Footer, Sidebar)
│   └── layouts/            # Layout wrappers (deprecated - now in layouts/ root)
│
├── features/               # Feature-based modules (self-contained)
│   ├── auth/               # Authentication (shared across all roles)
│   │   ├── pages/          # Auth pages (Login, Signup)
│   │   ├── components/     # Auth-specific components
│   │   ├── hooks/          # Auth hooks (useLogin, useSignup)
│   │   ├── services/       # Auth API calls
│   │   └── store/          # Auth state management
│   │
│   ├── candidates/         # Candidate-specific features
│   │   ├── pages/          # Candidate pages (CandidateDashboard, Profile, Applications, SavedJobs)
│   │   ├── components/     # Candidate components
│   │   ├── hooks/          # Candidate hooks
│   │   ├── services/       # Candidate API calls
│   │   └── store/          # Candidate state management
│   │
│   └── companies/          # Company/Client section
│       ├── pages/          # Company pages (Dashboard, Profile, PostJob, ManageJobs)
│       ├── components/     # Company components
│       ├── hooks/          # Company hooks
│       ├── services/       # Company API calls
│       └── store/          # Company state management
│
├── layouts/                # Page layouts
│   ├── RootLayout.jsx      # Main app layout
│   ├── AuthLayout.jsx      # Authentication layout
│   ├── CandidateDashboardLayout.jsx   # Candidate dashboard layout
│   └── CompanyDashboardLayout.jsx     # Company dashboard layout
│
├── pages/                  # Top-level pages
│   ├── Home.jsx            # Landing/home page
│   ├── NotFound.jsx        # 404 page
│   └── Unauthorized.jsx    # 403 page
│
├── router/                 # Routing configuration
│   ├── index.jsx           # Main router configuration
│   ├── authRoutes.jsx      # Auth routes
│   ├── candidateRoutes.jsx # Candidate routes
│   └── companyRoutes.jsx   # Company routes
│
├── hooks/                  # Global/shared custom hooks
│   ├── useAuth.js          # Auth hook
│   ├── useUserRole.js      # User role hook
│   └── useApi.js           # API call hook
│
├── services/               # API/External services
│   ├── api.js              # Base API configuration
│   ├── authService.js      # Auth API methods
│   ├── candidateService.js # Candidate API methods
│   └── companyService.js   # Company API methods
│
├── store/                  # State management
│   └── context/            # React Context API
│       ├── AuthContext.jsx # Authentication context
│       └── UserContext.jsx # User data context
│
├── utils/                  # Utility functions
│   ├── constants.js        # App-wide constants
│   ├── helpers.js          # Helper functions
│   └── validators.js       # Validation utilities
│
├── styles/                 # Global styles
│   └── index.css           # Global CSS
│
├── App.jsx
├── main.jsx
└── index.html
```

## 🏗️ Architecture Principles

### 1. **Feature-Based Organization**
- Each feature (auth, candidates, companies) is self-contained
- Contains everything it needs: pages, components, hooks, services, store
- Easy to maintain, test, and scale independently
- Can be easily disabled or removed without affecting other features

### 2. **Separation of Concerns**
- **Pages**: Full-page components that handle routing
- **Components**: Reusable UI components
- **Services**: API calls and external integrations
- **Hooks**: Custom React hooks for logic reuse
- **Store**: State management (Context, Redux, etc.)
- **Utils**: Helper functions and constants

### 3. **Service Layer**
- All API calls go through `services/` folder
- Keeps components clean and focused on UI
- Easy to mock for testing
- Centralized API configuration

### 4. **Modular Router**
- Routes split into `authRoutes.jsx`, `candidateRoutes.jsx`, `companyRoutes.jsx`
- Easy to manage complex routing as app grows
- Easier to add/remove routes for entire features
- Better code organization and readability

### 5. **Context-Based State Management**
- `AuthContext`: User authentication state
- `UserContext`: User profile and preferences
- Easily extendable for Redux/Zustand if needed

---

## 🚀 How to Add New Features

### Example: Adding an "Admin" Feature

1. **Create feature directory**:
   ```
   src/features/admin/
   ├── pages/
   ├── components/
   ├── hooks/
   ├── services/
   └── store/
   ```

2. **Create admin routes** (`src/router/adminRoutes.jsx`):
   ```jsx
   const adminRoutes = {
     path: 'admin',
     element: <AdminDashboardLayout />,
     children: [
       // admin routes
     ],
   };
   ```

3. **Import and add to main router** (`src/router/index.jsx`):
   ```jsx
   import adminRoutes from './adminRoutes';
   
   // In router children array
   adminRoutes,
   ```

4. **Create admin services** if needed (`src/features/admin/services/adminService.js`)

---

## 📦 Key Files

### `src/router/index.jsx`
Main router configuration. Imports all modular route files.

### `src/services/api.js`
Base API configuration. All other services extend this.

### `src/store/context/AuthContext.jsx`
Global authentication state. Use with `useAuthContext()` hook.

### `src/utils/constants.js`
App-wide constants: roles, statuses, routes, API endpoints.

---

## 🔄 Data Flow

### Authentication Flow
1. User fills login form in `Auth` feature
2. Form calls `authService.login()`
3. Service calls API via `api.js`
4. Response updates `AuthContext`
5. App redirects to appropriate dashboard (candidate or company)

### Feature-Specific Data Flow
1. Component calls custom hook (e.g., `useCandidateProfile()`)
2. Hook uses `candidateService` to fetch data
3. Service calls `api` with endpoint
4. Component receives data and renders

---

## 🔐 Role-Based Access

Use `useUserRole()` hook to check user role:

```jsx
import { useUserRole } from '@/hooks/useUserRole';

function MyComponent() {
  const { isCandidate, isCompany, role } = useUserRole();
  
  if (isCandidate) {
    return <CandidateDashboard />;
  }
  
  if (isCompany) {
    return <CompanyDashboard />;
  }
  
  return <AccessDenied />;
}
```

---

## 🛠️ Future Enhancements

- [ ] Add Redux for complex state management
- [ ] Add tests for each feature
- [ ] Add TypeScript for type safety
- [ ] Add Error Boundary components
- [ ] Add Protected Routes wrapper
- [ ] Add API error handling middleware
- [ ] Add Rate limiting for API calls
- [ ] Add Logging/Analytics service

---

## 📝 Best Practices

1. **Keep components small and focused**
2. **Use custom hooks for component logic**
3. **Keep services pure (no side effects)**
4. **Use constants instead of magic strings**
5. **Organize imports: React, third-party, local**
6. **Use meaningful names for files and functions**
7. **Keep styles scoped to components when possible**
8. **Document complex logic with comments**

---

## 🚄 Scalability Notes

This architecture scales well because:
- ✅ Features are independent and don't depend on each other
- ✅ Adding new features doesn't require modifying existing code
- ✅ Easy to split into separate repositories if needed
- ✅ Clear separation between UI, logic, and data
- ✅ Modular routing allows lazy loading
- ✅ Services can be easily swapped for different implementations
- ✅ State management is centralized and predictable
