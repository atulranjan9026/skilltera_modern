# Component Architecture Map

## Page Hierarchy & Component Usage

```
┌─ RootLayout
│
├─ Sidebar ← AuthLayout, UserLayout
│   ├─ Logo (Link to /)
│   ├─ Nav Links → JobSearchPage, UserDashboard
│   ├─ User Menu → ProfilePage
│   └─ Mobile Hamburger
│
└─ Routes
   ├─ /auth/login → AuthLayout → Login
   ├─ /auth/signup → AuthLayout → candidateSignup
   │
   └─ UserLayout (Sidebar + Outlet + Footer)
      ├─ / → LandingPage
      │   ├─ SearchBar → onSearch() → /jobs-search
      │   └─ CTA Buttons
      │
      ├─ /jobs-search → JobSearchPage
      │   ├─ SearchBar ← user input
      │   ├─ FilterSidebar (desktop) or MobileFilterPanel (mobile)
      │   │   ├─ Job Type checkboxes
      │   │   ├─ Experience Level checkboxes
      │   │   └─ Salary Range dropdown
      │   ├─ JobCard[] (grid)
      │   │   ├─ Save button → onSave()
      │   │   └─ Apply button → onApply()
      │   └─ EmptyState (if no results)
      │
      ├─ /dashboard → UserDashboard
      │   ├─ Saved Jobs Tab
      │   │   └─ JobCard[] (list view)
      │   └─ Applied Jobs Tab
      │       └─ JobCard[] (list view)
      │
      ├─ /profile → ProfilePage
      │   ├─ Resume Upload
      │   │   └─ Mock Parse → auto-fill
      │   ├─ Personal Info
      │   │   └─ Input[] (text fields)
      │   ├─ Skills
      │   │   ├─ Badge[] (display)
      │   │   └─ Input + Button (add)
      │   ├─ Experience (read-only)
      │   └─ Education (read-only)
      │
      └─ Footer
          ├─ Brand Section
          ├─ Quick Links
          ├─ Social Icons
          └─ Legal Links
```

## Component Dependency Tree

```
JobSearchPage
├── SearchBar
│   └── Input (via THEME_CLASSES)
├── FilterSidebar
│   ├── mockData (JOB_TYPES, EXPERIENCE_LEVELS, SALARY_RANGES)
│   └── THEME_CLASSES
├── MobileFilterPanel
│   └── FilterSidebar
├── JobCard[]
│   ├── Badge[] (jobType, experience)
│   ├── Heart icon (save button)
│   └── THEME_CLASSES
└── EmptyState

ProfilePage
├── Input[]
│   └── THEME_CLASSES
├── Upload input
├── Badge[] (skills)
└── THEME_CLASSES

UserDashboard
├── Tabs
├── JobCard[] (in list mode)
│   └── Badge
├── THEME_CLASSES
└── mockData (MOCK_USER)

LandingPage
├── SearchBar
├── Badge (on feature cards)
├── THEME_CLASSES
└── React Router (Links)

Sidebar
├── React Router (Link, useNavigate)
├── Lucide Icons
└── THEME_CLASSES

Footer
├── React Router (Link)
├── Lucide Icons
└── Static content
```

## Data Flow Diagram

```
LandingPage
    ↓
    └──→ User searches → navigate to JobSearchPage
            ↓
            SearchBar (input) → onSearch() → filter state
            ↓
            FilterSidebar (input) → onFilterChange() → filter state
            ↓
            Filtered MOCK_JOBS → JobCard[]
                ↓
                User clicks save → onSave() → savedJobs state
                User clicks apply → onApply() → mock alert
                ↓
                User clicks profile icon in Sidebar → ProfilePage
                    ↓
                    ProfilePage displays MOCK_USER
                    User uploads resume → mock parsing
                    User edits fields → update profile state
                    ↓
                    User clicks Dashboard → UserDashboard
                        ↓
                        Shows savedJobs and appliedJobs
```

## File Structure with Component Usage

```
src/
├── components/
│   ├── Sidebar.jsx ────────────────┐
│   │                               ├─ Used in UserLayout
│   ├── Footer.jsx ────────────────┘
│   │
│   ├── jobs/
│   │   ├── JobCard.jsx ──── Used in JobSearchPage, UserDashboard
│   │   ├── SearchBar.jsx ── Used in LandingPage, JobSearchPage
│   │   ├── FilterSidebar.jsx ──── Used in JobSearchPage, MobileFilterPanel
│   │   └── MobileFilterPanel.jsx ─ Used in JobSearchPage
│   │
│   └── common/
│       ├── Input.jsx ───── Used in ProfilePage, SearchBar
│       ├── Badge.jsx ───── Used in JobCard, LandingPage
│       └── EmptyState.jsx ─ Used in JobSearchPage
│
├── features/
│   └── jobs/
│       └── pages/
│           ├── LandingPage.jsx ──── Route: /
│           ├── JobSearchPage.jsx ── Route: /jobs-search
│           ├── UserDashboard.jsx ─ Route: /dashboard
│           └── ProfilePage.jsx ──── Route: /profile
│
├── layouts/
│   ├── UserLayout.jsx ─ Wraps all user pages (/ /jobs-search /dashboard /profile)
│   └── AuthLayout.jsx ─ Wraps auth pages (/auth/login, /auth/signup)
│
├── router/
│   ├── index.jsx ──────────── Main router, uses jobRoutes
│   └── candidateRoutes.jsx ── jobRoutes (formerly candidateRoutes)
│
├── theme/
│   └── index.js ────── THEME, THEME_CLASSES (used in all components)
│
└── data/
    └── mockData.js ── MOCK_JOBS, JOB_TYPES, EXPERIENCE_LEVELS, SALARY_RANGES, MOCK_USER
```

## State Management Pattern

### Component Level (Current)
```javascript
// JobSearchPage
const [jobs] = useState(MOCK_JOBS);
const [filters, setFilters] = useState({...});
const [searchQuery, setSearchQuery] = useState({...});
const [savedJobs, setSavedJobs] = useState([]);

// ProfilePage
const [profile, setProfile] = useState(MOCK_USER);
const [resumeFile, setResumeFile] = useState(null);
const [isEditing, setIsEditing] = useState(false);

// UserDashboard
const [activeTab, setActiveTab] = useState('saved');
const [savedJobIds] = useState([1, 3]); // Mock data
```

### Upgrade Path (Future)
```javascript
// With AuthContext
const { user } = useAuth();
const profile = user; // No useState needed

// With API Service
useEffect(() => {
  candidateService.getJobs().then(setJobs);
}, [filters, searchQuery]);

// With Redux or Context for global state
const { savedJobs, appliedJobs } = useJobContext();
```

## Styling System

### Three Levels of Styling

**Level 1: Raw Tailwind Classes**
```jsx
<div className="w-full px-4 py-8">
```

**Level 2: THEME_CLASSES Utilities**
```jsx
<div className={THEME_CLASSES.cards}>
<input className={THEME_CLASSES.inputs} />
<button className={THEME_CLASSES.buttons.primary}>
<span className={THEME_CLASSES.badges.primary}>
```

**Level 3: Component Composition**
```jsx
<JobCard job={job} isSaved={saved} onSave={handleSave} />
<Input label="Name" value={name} onChange={handleChange} />
```

### Color Reference by Component

| Component | Color | Tailwind Class |
|-----------|-------|---|
| JobCard Button | Primary Orange | bg-primary-600 |
| SearchBar Focus | Primary Orange Ring | focus:ring-primary-500 |
| FilterSidebar Checkbox | Primary Orange Accent | accent-primary-500 |
| Badge (Job Type) | Primary | bg-primary-100 text-primary-700 |
| Badge (Experience) | Info Blue | bg-blue-100 text-blue-700 |
| Save Heart Filled | Primary | text-primary-600 |
| Sidebar Link Hover | Primary | text-primary-600 |
| Footer Link Hover | White | text-white |

## Responsive Breakpoints & Layout Changes

### Mobile (< 768px)
```
LandingPage:
  - Full width SearchBar
  - Stats in 2 columns
  - Features full width, stacked

JobSearchPage:
  - Search bar full width
  - Filter button visible
  - JobCard in single column
  - MobileFilterPanel overlay

ProfilePage:
  - Single column layout
  - Full width inputs
  - Resume upload centered

Sidebar:
  - Hamburger menu visible
  - Logo + menu icon only
  - Mobile nav dropdown
```

### Desktop (>= 1024px)
```
JobSearchPage:
  - 3-column: FilterSidebar + JobCard grid (2-3 cols)
  - Sticky sidebar
  - Filter button hidden

Sidebar:
  - Full nav links visible
  - User dropdown
  - Logo + full Sidebar

Footer:
  - 4-column grid
  - Horizontal social icons
```

## Integration Checklist

### Phase 1: Setup ✅
- [x] Create pages (Landing, Search, Dashboard, Profile)
- [x] Create components (Sidebar, Footer, cards, filters)
- [x] Set up theme system
- [x] Add mock data
- [x] Update router

### Phase 2: Backend Integration
- [ ] Connect JobSearchPage to real API
- [ ] Connect ProfilePage to AuthContext
- [ ] Implement resume parsing service
- [ ] Connect dashboard to API
- [ ] Set up error boundaries

### Phase 3: UX Enhancements
- [ ] Add loading skeletons
- [ ] Add toast notifications
- [ ] Implement pagination
- [ ] Add job detail page
- [ ] Add application modal

### Phase 4: Features
- [ ] Saved jobs API integration
- [ ] Applied jobs tracking
- [ ] Job recommendations
- [ ] Email notifications
- [ ] Advanced filters

### Phase 5: Scaling
- [ ] Admin dashboard
- [ ] Company/employer section
- [ ] Analytics
- [ ] A/B testing
- [ ] Performance optimization
