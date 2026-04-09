import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Briefcase, MapPin } from 'lucide-react';
import SearchBar from './JobSerching/Search/SearchBar';
import { THEME_CLASSES } from '../../theme';
import { chatService } from '../../services/chatService';
import { notificationsService } from '../../services/notificationsService';
import { useAuthContext } from '../../store/context/AuthContext';

/**
 * Landing Page - Hero section with job search and CTAs
 */
export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [unreadMessages, setUnreadMessages] = React.useState(0);
  const [unreadNotifications, setUnreadNotifications] = React.useState(0);

  const fetchUnreadMessages = async () => {
    try {
      const response = await chatService.getUserConversations();
      if (response?.success) {
        const conversations = response.conversations || [];
        const totalUnread = conversations.reduce((sum, conv) => sum + (conv.candidateUnread || 0), 0);
        setUnreadMessages(totalUnread);
      }
    } catch (err) {
      console.error('Failed to fetch unread messages:', err);
      setUnreadMessages(0);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const response = await notificationsService.getUnreadCount(user._id);
      if (response?.success) {
        setUnreadNotifications(response.count || 0);
      } else {
        setUnreadNotifications(0);
      }
    } catch (err) {
      console.error('Failed to fetch unread notifications:', err);
      setUnreadNotifications(0);
    }
  };

  React.useEffect(() => {
    if (user?._id) {
      fetchUnreadMessages();
      fetchUnreadNotifications();
    }
  }, [user?._id]);

  const handleSearch = (query) => {
    setSearchQuery(JSON.stringify(query));
    // Redirect to job search with query params
    window.location.href = `/jobs-search?job=${query.jobTitle}&location=${query.location}`;
  };

  const features = [
    {
      icon: '🎯',
      title: 'Smart Job Matching',
      jobDescription: 'Find jobs that match your skills and preferences',
    },
    {
      icon: '⚡',
      title: 'Quick Application',
      jobDescription: 'Apply to jobs in seconds with your saved profile',
    },
    {
      icon: '📊',
      title: 'Track Your Progress',
      jobDescription: 'Keep track of all your applications and saved jobs',
    },
    {
      icon: '🔔',
      title: 'Job Alerts',
      jobDescription: 'Get notified when jobs matching your preferences are posted',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary-50 via-white to-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
              Find Your <span className="text-primary-600">Dream Job</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              Discover thousands of job opportunities from top companies. Search, apply, and land your next role.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <SearchBar 
              onSearch={handleSearch} 
              onNotificationsClick={() => {/* TODO: navigate to notifications */}}
              onChatClick={() => navigate('/chat')} 
              unreadNotifications={unreadNotifications}
              unreadMessages={unreadMessages}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary-600">10K+</p>
              <p className="text-sm text-slate-600">Active Jobs</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary-600">5K+</p>
              <p className="text-sm text-slate-600">Companies</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary-600">50K+</p>
              <p className="text-sm text-slate-600">Applicants</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary-600">95%</p>
              <p className="text-sm text-slate-600">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-100/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Skilltera?
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to find and land your perfect job.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className={`${THEME_CLASSES.cards} p-8`}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.jobDescription}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ready to find your next opportunity?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of professionals finding their dream jobs on Skilltera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/jobs-search">
                <button className={`${THEME_CLASSES.buttons.primary} px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200`}>
                  Search Jobs
                  <ArrowRight size={18} />
                </button>
              </Link>
              <Link to="/auth/signup">
                <button className={`${THEME_CLASSES.buttons.secondary} px-8 py-3 rounded-lg font-medium transition-all duration-200`}>
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
