import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  Calendar, 
  Clock, 
  Target,
  BarChart3,
  Activity,
  DollarSign,
  Eye,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import { tokens, animations } from '../../styles/designTokens';

// Real-time data service
const realtimeService = {
  connect: (callback) => {
    // Simulate WebSocket connection
    const interval = setInterval(() => {
      const mockUpdates = [
        { type: 'application', count: Math.floor(Math.random() * 5) + 1 },
        { type: 'interview', count: Math.floor(Math.random() * 3) + 1 },
        { type: 'job_view', count: Math.floor(Math.random() * 10) + 5 },
        { type: 'candidate_active', count: Math.floor(Math.random() * 3) + 1 },
      ];
      
      const update = mockUpdates[Math.floor(Math.random() * mockUpdates.length)];
      callback(update);
    }, 5000 + Math.random() * 10000); // Random intervals between 5-15 seconds

    return () => clearInterval(interval);
  },

  getInitialMetrics: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      overview: {
        totalJobs: 45,
        activeJobs: 12,
        totalApplications: 1234,
        pendingApplications: 89,
        interviewsScheduled: 67,
        interviewsCompleted: 45,
        offersExtended: 23,
        offersAccepted: 18,
        averageTimeToHire: 28,
        costPerHire: 4500,
      },
      liveMetrics: {
        activeCandidates: 156,
        currentViews: 89,
        pendingReviews: 23,
        urgentTasks: 7,
        teamOnline: 12,
        responseRate: 87,
      },
      recentActivity: [
        {
          id: 1,
          type: 'application',
          title: 'New application for Senior Frontend Developer',
          user: 'John Doe',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          priority: 'high',
        },
        {
          id: 2,
          type: 'interview',
          title: 'Interview completed with Jane Smith',
          user: 'Sarah Johnson',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          priority: 'medium',
        },
        {
          id: 3,
          type: 'job',
          title: 'Product Manager job posting viewed 25 times',
          user: 'System',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          priority: 'low',
        },
      ],
      performance: {
        today: {
          applications: 34,
          interviews: 12,
          offers: 5,
          hires: 3,
        },
        yesterday: {
          applications: 28,
          interviews: 8,
          offers: 3,
          hires: 2,
        },
        lastWeek: {
          applications: 189,
          interviews: 67,
          offers: 23,
          hires: 18,
        },
      },
    };
  },
};

// Metric Card with real-time updates
const RealTimeMetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  subtitle, 
  isLive = false,
  liveActivity = null,
  trend = 'up'
}) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (liveActivity) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [liveActivity]);

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp size={16} />;
    if (trend === 'down') return <ArrowDown size={16} />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return tokens.colors.semantic.success[500];
    if (trend === 'down') return tokens.colors.semantic.error[500];
    return tokens.colors.secondary[500];
  };

  return (
    <motion.div
      className="realtime-metric-card"
      whileHover={{ y: -2, boxShadow: tokens.shadows.lg }}
      style={{
        backgroundColor: 'white',
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing[6],
        border: `1px solid ${tokens.colors.secondary[200]}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Live indicator */}
      {isLive && (
        <div
          className="live-indicator"
          style={{
            position: 'absolute',
            top: tokens.spacing[3],
            right: tokens.spacing[3],
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[1],
            padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
            borderRadius: tokens.borderRadius.sm,
            backgroundColor: tokens.colors.semantic.error[100],
            color: tokens.colors.semantic.error[600],
            fontSize: tokens.typography.fontSize.xs[0],
            fontWeight: tokens.typography.fontWeight.medium,
          }}
        >
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: tokens.colors.semantic.error[500],
            animation: pulse ? 'pulse 1s infinite' : 'none',
          }} />
          LIVE
        </div>
      )}

      {/* Background accent */}
      <div
        className="metric-accent"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: color,
        }}
      />

      <div className="metric-content" style={{ display: 'flex', alignItems: 'flex-start', gap: tokens.spacing[4] }}>
        <div
          className="metric-icon"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: tokens.borderRadius.lg,
            backgroundColor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon style={{ color, width: '24px', height: '24px' }} />
        </div>
        
        <div className="metric-details" style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: tokens.typography.fontSize.xs[0], 
            color: tokens.colors.secondary[600],
            fontWeight: tokens.typography.fontWeight.medium,
            textTransform: 'uppercase',
            letterSpacing: tokens.typography.letterSpacing.wide,
          }}>
            {title}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: tokens.spacing[2], marginTop: tokens.spacing[1] }}>
            <p style={{ 
              margin: 0, 
              fontSize: tokens.typography.fontSize['3xl'][0], 
              fontWeight: tokens.typography.fontWeight.bold,
              color: tokens.colors.secondary[900],
              lineHeight: 1,
            }}>
              {value}
            </p>
            
            {change !== undefined && (
              <div className="metric-change" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: tokens.spacing[1],
              }}>
                {getTrendIcon()}
                <span style={{ 
                  fontSize: tokens.typography.fontSize.sm[0], 
                  fontWeight: tokens.typography.fontWeight.medium,
                  color: getTrendColor(),
                }}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          
          {subtitle && (
            <p style={{ 
              margin: `${tokens.spacing[1]} 0 0 0`, 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.secondary[500],
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Live activity indicator */}
      {liveActivity && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="live-activity"
          style={{
            position: 'absolute',
            bottom: tokens.spacing[3],
            right: tokens.spacing[3],
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[1],
            padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
            borderRadius: tokens.borderRadius.sm,
            backgroundColor: `${color}20`,
            color: color,
            fontSize: tokens.typography.fontSize.xs[0],
            fontWeight: tokens.typography.fontWeight.medium,
          }}
        >
          <Zap size={12} />
          +{liveActivity}
        </motion.div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
};

// Activity Feed Component
const ActivityFeed = ({ activities, onActivityClick }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'application': return <Users size={16} />;
      case 'interview': return <Calendar size={16} />;
      case 'job': return <Briefcase size={16} />;
      case 'offer': return <Target size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'application': return tokens.colors.primary[500];
      case 'interview': return tokens.colors.semantic.warning[500];
      case 'job': return tokens.colors.semantic.success[500];
      case 'offer': return tokens.colors.semantic.error[500];
      default: return tokens.colors.secondary[500];
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return tokens.colors.semantic.error[500];
      case 'medium': return tokens.colors.semantic.warning[500];
      case 'low': return tokens.colors.semantic.success[500];
      default: return tokens.colors.secondary[500];
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <motion.div
      className="activity-feed"
      style={{
        backgroundColor: 'white',
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing[6],
        border: `1px solid ${tokens.colors.secondary[200]}`,
      }}
    >
      <h3 style={{ 
        margin: 0, 
        fontSize: tokens.typography.fontSize.lg[0], 
        fontWeight: tokens.typography.fontWeight.semibold,
        color: tokens.colors.secondary[900],
        marginBottom: tokens.spacing[4],
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[2],
      }}>
        <Activity size={20} style={{ color: tokens.colors.primary[500] }} />
        Live Activity Feed
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[3] }}>
        <AnimatePresence>
          {activities.slice(0, 5).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: tokens.animations.duration[300], delay: index * 0.1 }}
              className="activity-item"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: tokens.spacing[3],
                padding: tokens.spacing[3],
                borderRadius: tokens.borderRadius.md,
                backgroundColor: tokens.colors.secondary[50],
                cursor: 'pointer',
                transition: `all ${tokens.animations.duration[150]}`,
              }}
              onClick={() => onActivityClick(activity)}
              whileHover={{ backgroundColor: tokens.colors.secondary[100] }}
            >
              <div
                className="activity-icon"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: tokens.borderRadius.md,
                  backgroundColor: `${getActivityColor(activity.type)}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ color: getActivityColor(activity.type) }}>
                  {getActivityIcon(activity.type)}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: tokens.spacing[2] }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: tokens.typography.fontSize.sm[0], 
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.secondary[900],
                    lineHeight: tokens.typography.fontSize.sm[1],
                  }}>
                    {activity.title}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2], flexShrink: 0 }}>
                    <div
                      className="priority-indicator"
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getPriorityColor(activity.priority),
                      }}
                    />
                    <span style={{ 
                      fontSize: tokens.typography.fontSize.xs[0], 
                      color: tokens.colors.secondary[500],
                      whiteSpace: 'nowrap',
                    }}>
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
                
                <p style={{ 
                  margin: `${tokens.spacing[1]} 0 0 0`, 
                  fontSize: tokens.typography.fontSize.xs[0], 
                  color: tokens.colors.secondary[600],
                }}>
                  {activity.user}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {activities.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: tokens.spacing[6],
          color: tokens.colors.secondary[500],
        }}>
          <Activity size={32} style={{ margin: '0 auto', marginBottom: tokens.spacing[3], opacity: 0.5 }} />
          <p style={{ fontSize: tokens.typography.fontSize.sm[0] }}>No recent activity</p>
        </div>
      )}
    </motion.div>
  );
};

// Performance Comparison Component
const PerformanceComparison = ({ data }) => {
  const calculateChange = (current, previous) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const metrics = [
    {
      label: 'Applications',
      today: data.today.applications,
      yesterday: data.yesterday.applications,
      weekTotal: data.lastWeek.applications,
      icon: Users,
      color: tokens.colors.primary[500],
    },
    {
      label: 'Interviews',
      today: data.today.interviews,
      yesterday: data.yesterday.interviews,
      weekTotal: data.lastWeek.interviews,
      icon: Calendar,
      color: tokens.colors.semantic.warning[500],
    },
    {
      label: 'Offers',
      today: data.today.offers,
      yesterday: data.yesterday.offers,
      weekTotal: data.lastWeek.offers,
      icon: Target,
      color: tokens.colors.semantic.error[500],
    },
    {
      label: 'Hires',
      today: data.today.hires,
      yesterday: data.yesterday.hires,
      weekTotal: data.lastWeek.hires,
      icon: CheckCircle,
      color: tokens.colors.semantic.success[500],
    },
  ];

  return (
    <motion.div
      className="performance-comparison"
      style={{
        backgroundColor: 'white',
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing[6],
        border: `1px solid ${tokens.colors.secondary[200]}`,
      }}
    >
      <h3 style={{ 
        margin: 0, 
        fontSize: tokens.typography.fontSize.lg[0], 
        fontWeight: tokens.typography.fontWeight.semibold,
        color: tokens.colors.secondary[900],
        marginBottom: tokens.spacing[4],
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[2],
      }}>
        <BarChart3 size={20} style={{ color: tokens.colors.primary[500] }} />
        Performance Comparison
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: tokens.spacing[4] }}>
        {metrics.map((metric, index) => {
          const dayChange = calculateChange(metric.today, metric.yesterday);
          const Icon = metric.icon;
          
          return (
            <motion.div
              key={metric.label}
              className="performance-metric"
              whileHover={{ y: -2 }}
              style={{
                padding: tokens.spacing[4],
                borderRadius: tokens.borderRadius.md,
                backgroundColor: tokens.colors.secondary[50],
                border: `1px solid ${tokens.colors.secondary[200]}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2], marginBottom: tokens.spacing[3] }}>
                <Icon size={16} style={{ color: metric.color }} />
                <span style={{ 
                  fontSize: tokens.typography.fontSize.sm[0], 
                  fontWeight: tokens.typography.fontWeight.semibold,
                  color: tokens.colors.secondary[900],
                }}>
                  {metric.label}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: tokens.spacing[2] }}>
                <div>
                  <span style={{ 
                    fontSize: tokens.typography.fontSize['2xl'][0], 
                    fontWeight: tokens.typography.fontWeight.bold,
                    color: tokens.colors.secondary[900],
                  }}>
                    {metric.today}
                  </span>
                  <span style={{ 
                    fontSize: tokens.typography.fontSize.xs[0], 
                    color: tokens.colors.secondary[500],
                    marginLeft: tokens.spacing[1],
                  }}>
                    today
                  </span>
                </div>
                
                {dayChange !== 0 && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: tokens.spacing[1],
                    fontSize: tokens.typography.fontSize.xs[0],
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: dayChange > 0 ? tokens.colors.semantic.success[500] : tokens.colors.semantic.error[500],
                  }}>
                    {dayChange > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {Math.abs(dayChange)}%
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: tokens.typography.fontSize.xs[0], color: tokens.colors.secondary[600] }}>
                <span>Yesterday: {metric.yesterday}</span>
                <span>Week: {metric.weekTotal}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Main Enhanced Dashboard Component
export const EnhancedDashboard = ({ user }) => {
  const [metrics, setMetrics] = useState(null);
  const [liveActivity, setLiveActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await realtimeService.getInitialMetrics();
        setMetrics(data);
        setActivities(data.recentActivity);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Set up real-time updates
  useEffect(() => {
    if (!metrics) return;

    const cleanup = realtimeService.connect((update) => {
      setLiveActivity(update);
      
      // Update activities
      const newActivity = {
        id: Date.now(),
        type: update.type,
        title: `${update.count} new ${update.type}${update.count > 1 ? 's' : ''}`,
        user: 'System',
        timestamp: new Date(),
        priority: update.count > 3 ? 'high' : update.count > 1 ? 'medium' : 'low',
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);

      // Update metrics based on activity
      setMetrics(prev => {
        if (!prev) return prev;
        
        const updated = { ...prev };
        
        switch (update.type) {
          case 'application':
            updated.overview.totalApplications += update.count;
            updated.performance.today.applications += update.count;
            break;
          case 'interview':
            updated.overview.interviewsScheduled += update.count;
            updated.performance.today.interviews += update.count;
            break;
          case 'job_view':
            updated.liveMetrics.currentViews += update.count;
            break;
          case 'candidate_active':
            updated.liveMetrics.activeCandidates += update.count;
            break;
        }
        
        return updated;
      });

      setLastUpdate(new Date());
    });

    return cleanup;
  }, [metrics]);

  const handleActivityClick = (activity) => {
    console.log('Activity clicked:', activity);
    // Navigate to relevant page based on activity type
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await realtimeService.getInitialMetrics();
      setMetrics(data);
      setActivities(data.recentActivity);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: tokens.colors.secondary[500],
      }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw className="w-8 h-8 animate-spin" style={{ margin: '0 auto', marginBottom: tokens.spacing[3] }} />
          <p style={{ fontSize: tokens.typography.fontSize.sm[0] }}>Loading real-time dashboard...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: tokens.colors.secondary[500],
      }}>
        <p>Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="enhanced-dashboard" style={{ padding: tokens.spacing[6] }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: tokens.spacing[6],
      }}>
        <div>
          <h1 style={{ 
            fontSize: tokens.typography.fontSize['2xl'][0], 
            fontWeight: tokens.typography.fontWeight.bold,
            color: tokens.colors.secondary[900],
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[3],
          }}>
            <Zap style={{ color: tokens.colors.primary[500] }} />
            Real-Time Dashboard
          </h1>
          <p style={{ 
            fontSize: tokens.typography.fontSize.base[0], 
            color: tokens.colors.secondary[600],
            margin: `${tokens.spacing[2]} 0 0 0`,
          }}>
            Live hiring metrics and activity monitoring
          </p>
          {lastUpdate && (
            <p style={{ 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.secondary[500],
              margin: `${tokens.spacing[1]} 0 0 0`,
            }}>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <button
          onClick={handleRefresh}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[2],
            padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
            borderRadius: tokens.borderRadius.md,
            border: `1px solid ${tokens.colors.secondary[300]}`,
            backgroundColor: 'white',
            fontSize: tokens.typography.fontSize.sm[0],
            color: tokens.colors.secondary[700],
            cursor: 'pointer',
            transition: `all ${tokens.animations.duration[150]}`,
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Live Metrics Grid */}
      <div style={{ marginBottom: tokens.spacing[6] }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: tokens.spacing[4] 
        }}>
          <RealTimeMetricCard
            title="Active Candidates"
            value={metrics.liveMetrics.activeCandidates}
            change={12}
            icon={Users}
            color={tokens.colors.primary[500]}
            subtitle="Currently engaged"
            isLive={true}
            liveActivity={liveActivity?.type === 'candidate_active' ? liveActivity.count : null}
          />
          
          <RealTimeMetricCard
            title="Current Views"
            value={metrics.liveMetrics.currentViews}
            change={8}
            icon={Eye}
            color={tokens.colors.semantic.success[500]}
            subtitle="Job views this hour"
            isLive={true}
            liveActivity={liveActivity?.type === 'job_view' ? liveActivity.count : null}
          />
          
          <RealTimeMetricCard
            title="Pending Reviews"
            value={metrics.liveMetrics.pendingReviews}
            change={-5}
            icon={AlertCircle}
            color={tokens.colors.semantic.warning[500]}
            subtitle="Awaiting action"
            isLive={true}
          />
          
          <RealTimeMetricCard
            title="Team Online"
            value={metrics.liveMetrics.teamOnline}
            change={0}
            icon={Users}
            color={tokens.colors.secondary[500]}
            subtitle="Active now"
            isLive={true}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 400px', 
        gap: tokens.spacing[6],
      }}>
        {/* Performance Comparison */}
        <PerformanceComparison data={metrics.performance} />
        
        {/* Activity Feed */}
        <ActivityFeed activities={activities} onActivityClick={handleActivityClick} />
      </div>

      {/* Overview Metrics */}
      <div style={{ marginTop: tokens.spacing[6] }}>
        <h2 style={{ 
          fontSize: tokens.typography.fontSize.lg[0], 
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.secondary[900],
          marginBottom: tokens.spacing[4],
        }}>
          Overview Metrics
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: tokens.spacing[4] 
        }}>
          <RealTimeMetricCard
            title="Total Jobs"
            value={metrics.overview.totalJobs}
            change={5}
            icon={Briefcase}
            color={tokens.colors.primary[500]}
            subtitle={`${metrics.overview.activeJobs} active`}
          />
          
          <RealTimeMetricCard
            title="Applications"
            value={metrics.overview.totalApplications}
            change={23}
            icon={Users}
            color={tokens.colors.semantic.success[500]}
            subtitle={`${metrics.overview.pendingApplications} pending`}
          />
          
          <RealTimeMetricCard
            title="Interviews"
            value={metrics.overview.interviewsCompleted}
            change={8}
            icon={Calendar}
            color={tokens.colors.semantic.warning[500]}
            subtitle={`${metrics.overview.interviewsScheduled} scheduled`}
          />
          
          <RealTimeMetricCard
            title="Offers"
            value={metrics.overview.offersAccepted}
            change={15}
            icon={Target}
            color={tokens.colors.semantic.error[500]}
            subtitle={`${metrics.overview.offersExtended} extended`}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
