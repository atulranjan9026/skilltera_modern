/**
 * Mock Job Data
 * Replace with real API calls later
 */

export const MOCK_JOBS = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp',
    logo: '💻',
    location: 'San Francisco, CA',
    salary: '$120,000 - $160,000',
    jobType: 'Full-time',
    experience: 'Senior',
    description: 'We are looking for an experienced React developer...',
    postedTime: '2 days ago',
    saved: false,
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    logo: '🎨',
    location: 'New York, NY',
    salary: '$80,000 - $120,000',
    jobType: 'Full-time',
    experience: 'Mid',
    description: 'Join our creative team to design beautiful user experiences...',
    postedTime: '1 day ago',
    saved: false,
  },
  {
    id: 3,
    title: 'Frontend Developer (Remote)',
    company: 'StartupXYZ',
    logo: '🚀',
    location: 'Remote',
    salary: '$70,000 - $100,000',
    jobType: 'Remote',
    experience: 'Mid',
    description: 'Build amazing web applications from anywhere...',
    postedTime: '3 hours ago',
    saved: false,
  },
  {
    id: 4,
    title: 'Junior Developer',
    company: 'Tech Academy',
    logo: '📚',
    location: 'Boston, MA',
    salary: '$50,000 - $75,000',
    jobType: 'Full-time',
    experience: 'Entry',
    description: 'Great opportunity for junior developers to grow...',
    postedTime: '5 days ago',
    saved: false,
  },
  {
    id: 5,
    title: 'Backend Engineer',
    company: 'CloudSystems',
    logo: '☁️',
    location: 'Seattle, WA',
    salary: '$100,000 - $150,000',
    jobType: 'Full-time',
    experience: 'Senior',
    description: 'Build scalable backend systems...',
    postedTime: '1 week ago',
    saved: false,
  },
  {
    id: 6,
    title: 'Part-time QA Tester',
    company: 'TestingPro',
    logo: '✅',
    location: 'Austin, TX',
    salary: '$30 - $50 /hr',
    jobType: 'Part-time',
    experience: 'Entry',
    description: 'Help us ensure quality software products...',
    postedTime: '2 days ago',
    saved: false,
  },
];

export const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract'];

export const EXPERIENCE_LEVELS = ['Entry', 'Mid', 'Senior'];

export const SALARY_RANGES = [
  { label: 'Under $50k', min: 0, max: 50000 },
  { label: '$50k - $100k', min: 50000, max: 100000 },
  { label: '$100k - $150k', min: 100000, max: 150000 },
  { label: '$150k+', min: 150000, max: 999999 },
];

export const CITIES = [
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Los Angeles, CA',
  'Chicago, IL',
  'Remote',
];

export const MOCK_USER = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '(555) 123-4567',
  location: 'San Francisco, CA',
  skills: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js'],
  experience: [
    {
      company: 'TechCorp',
      position: 'Frontend Developer',
      duration: '2021 - Present',
      description: 'Building amazing web applications',
    },
  ],
  education: [
    {
      school: 'University of California',
      degree: 'Bachelor of Computer Science',
      year: '2021',
    },
  ],
  portfolio: 'https://johndoe.com',
  resume: null,
  savedJobs: [],
  appliedJobs: [],
};
