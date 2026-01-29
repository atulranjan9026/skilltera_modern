# 📁 SkillTera Modern - File Structure Diagram

## 🎯 Current Organization

```
skilltera_modern/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📂 jobs/
│   │   │   ├── 📂 Search/           # 🔍 Search & Filter Components
│   │   │   │   ├── 📄 SearchBar.jsx
│   │   │   │   ├── 📄 SearchInput.jsx
│   │   │   │   ├── 📄 FilterButton.jsx
│   │   │   │   ├── 📄 FilterChips.jsx
│   │   │   │   └── 📄 AdvancedFilterModal.jsx
│   │   │   │
│   │   │   └── 📂 JobCard/          # 💼 Job Card Components
│   │   │       ├── 📄 JobCard.jsx
│   │   │       ├── 📄 JobDescription.jsx
│   │   │       └── 📄 JobListings.jsx
│   │   │
│   │   └── 📂 ui/                   # 🎨 UI Components (if any)
│   │
│   ├── 📂 features/
│   │   └── 📂 jobs/
│   │       └── 📂 pages/
│   │           ├── 📄 JobSearchPage.jsx    # 🔍 Main job search
│   │           ├── 📄 ProfilePage.jsx      # 👤 User profile
│   │           └── 📄 UserDashboard.jsx   # 📊 User dashboard
│   │
│   ├── 📂 layouts/
│   │   └── 📄 UserLayout.jsx       # 🏗️ Main layout wrapper
│   │
│   ├── 📂 router/
│   │   ├── 📄 index.jsx            # 🛣️ Main router config
│   │   ├── 📄 authRoutes.jsx       # 🔐 Authentication routes
│   │   └── 📄 candidateRoutes.jsx  # 👤 User/Candidate routes
│   │
│   ├── 📂 features/
│   │   └── 📂 auth/
│   │       └── 📂 pages/
│   │           └── 📄 Login.jsx   # 🔐 Login page
│   │
│   └── 📂 theme/
│       └── 📄 index.js             # 🎨 Theme configuration
```

## 🔄 Component Flow

### 📱 Job Search Flow
```
Login → JobSearchPage → SearchBar → JobListings → JobCard/JobDescription
```

### 📊 Route Structure
```
/ (Landing)
├── /login (Login)
├── /jobs (JobSearchPage)
├── /profile (ProfilePage)
└── /dashboard (UserDashboard)
```

## 🎯 Component Relationships

### 🔍 Search Components
```
SearchBar (Main)
├── SearchInput (Search field)
├── FilterButton (Filters button)
├── FilterChips (Active filters)
└── AdvancedFilterModal (Filter options)
```

### 💼 Job Components
```
JobListings (Container)
├── JobCard (Individual job card)
└── JobDescription (Job details panel)
```

## 🎨 Theme System
```
THEME_CLASSES
├── buttons (primary, secondary, ghost)
├── cards (card styling)
├── badges (primary, info, etc.)
└── borders (border colors)
```

## 📝 Key Features

### ✅ Implemented
- ✅ Job search with filters
- ✅ Split-view job listings
- ✅ Custom scrollbars
- ✅ Theme-based styling
- ✅ Responsive design
- ✅ File organization

### 🔄 Current Issues
- 🔄 Scrollbar heights need adjustment
- 🔄 File structure optimization

## 🎯 Recommendations

### 📁 Suggested Improvements
1. **Consistent naming**: Use kebab-case for folders
2. **Component grouping**: Group related components better
3. **Shared components**: Create common UI folder
4. **Utils folder**: Add utility functions

### 🏗️ Better Structure
```
src/
├── components/
│   ├── ui/              # Shared UI components
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── features/
│   ├── auth/            # Authentication
│   ├── jobs/            # Job management
│   └── profile/         # User profile
├── hooks/               # Custom hooks
├── utils/               # Utility functions
└── styles/              # Global styles
```

## 🚀 Next Steps

1. **Fix scrollbars**: Adjust height calculations
2. **Optimize imports**: Clean up unused imports
3. **Add error boundaries**: Better error handling
4. **Improve performance**: Add React.memo where needed
5. **Add tests**: Component testing

---

*Last updated: Current session*
*Status: Active development*
