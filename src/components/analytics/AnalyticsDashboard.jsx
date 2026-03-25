import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  Calendar, 
  Clock, 
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  DollarSign,
  Eye,
  Download,
  Filter,
  Calendar as CalendarIcon,
  RefreshCw
} from 'lucide-react';
import { tokens, animations } from '../../styles/designTokens';

// Mock analytics service
const analyticsService = {
  getMetrics: async (filters = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
        averageTimeToHire: 28, // days
        costPerHire: 4500,
        sourceOfHire: {
          'Direct': 35,
          'Referrals': 28,
          'LinkedIn': 20,
          'Indeed': 12,
          'Other': 5,
        },
      },
      trends: {
        applications: [
          { date: '2024-01', count: 120 },
          { date: '2024-02', count: 145 },
          { date: '2024-03', count: 167 },
          { date: '2024-04', count: 189 },
          { date: '2024-05', count: 234 },
          { date: '2024-06', count: 278 },
        ],
        hires: [
          { date: '2024-01', count: 8 },
          { date: '2024-02', count: 12 },
          { date: '2024-03', count: 15 },
          { date: '2024-04', count: 11 },
          { date: '2024-05', count: 18 },
          { date: '2024-06', count: 23 },
        ],
        timeToHire: [
          { date: '2024-01', days: 32 },
          { date: '2024-02', days: 29 },
          { date: '2024-03', days: 27 },
          { date: '2024-04', days: 31 },
          { date: '2024-05', days: 26 },
          { date: '2024-06', days: 28 },
        ],
      },
      funnel: [
        { stage: 'Applied', count: 1234, percentage: 100 },
        { stage: 'Screened', count: 890, percentage: 72 },
        { stage: 'Interviewed', count: 456, percentage: 37 },
        { stage: 'Shortlisted', count: 234, percentage: 19 },
        { stage: 'Offered', count: 67, percentage: 5 },
        { stage: 'Hired', count: 45, percentage: 4 },
      ],
      departmentPerformance: [
        { department: 'Engineering', hires: 15, applications: 234, efficiency: 85 },
        { department: 'Sales', hires: 12, applications: 189, efficiency: 78 },
        { department: 'Marketing', hires: 8, applications: 156, efficiency: 72 },
        { department: 'Product', hires: 6, applications: 98, efficiency: 68 },
        { department: 'HR', hires: 4, applications: 67, efficiency: 62 },
      ],
      recruiterPerformance: [
        { name: 'Sarah Johnson', hires: 12, interviews: 45, rating: 4.8 },
        { name: 'Mike Chen', hires: 10, interviews: 38, rating: 4.6 },
        { name: 'Emily Davis', hires: 8, interviews: 32, rating: 4.7 },
        { name: 'Alex Turner', hires: 7, interviews: 28, rating: 4.5 },
      ],
    };
  },
  
  getPredictions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      hiringNeeds: [
        { department: 'Engineering', positions: 8, priority: 'high', timeline: 'Q3 2024' },
        { department: 'Sales', positions: 5, priority: 'medium', timeline: 'Q4 2024' },
        { department: 'Marketing', positions: 3, priority: 'low', timeline: 'Q1 2025' },
      ],
      budgetForecast: {
        currentQuarter: 125000,
        nextQuarter: 145000,
        variance: '+16%',
      },
      marketTrends: {
        demandIncrease: '+12%',
        salaryInflation: '+5%',
        competitionLevel: 'high',
      },
    };
  },
};

// Metric card component
const MetricCard = ({ title, value, change, icon, color, subtitle, trend }) => {
  const isPositive = change >= 0;
  const Icon = icon;
  
  return (
    <motion.div
      className="metric-card"
      whileHover={{ y: -2, boxShadow: tokens.shadows.lg }}
      transition={{ duration: tokens.animations.duration[200] }}
      style={{
        backgroundColor: 'white',
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing[6],
        border: `1px solid ${tokens.colors.secondary[200]}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
          
          <p style={{ 
            margin: `${tokens.spacing[1]} 0 0 0`, 
            fontSize: tokens.typography.fontSize['3xl'][0], 
            fontWeight: tokens.typography.fontWeight.bold,
            color: tokens.colors.secondary[900],
            lineHeight: 1,
          }}>
            {value}
          </p>
          
          {subtitle && (
            <p style={{ 
              margin: `${tokens.spacing[1]} 0 0 0`, 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.secondary[500],
            }}>
              {subtitle}
            </p>
          )}
          
          {change !== undefined && (
            <div className="metric-change" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: tokens.spacing[1],
              marginTop: tokens.spacing[2],
            }}>
              {isPositive ? (
                <TrendingUp style={{ 
                  color: tokens.colors.semantic.success[500], 
                  width: '16px', 
                  height: '16px' 
                }} />
              ) : (
                <TrendingDown style={{ 
                  color: tokens.colors.semantic.error[500], 
                  width: '16px', 
                  height: '16px' 
                }} />
              )}
              <span style={{ 
                fontSize: tokens.typography.fontSize.sm[0], 
                fontWeight: tokens.typography.fontWeight.medium,
                color: isPositive ? tokens.colors.semantic.success[500] : tokens.colors.semantic.error[500],
              }}>
                {isPositive ? '+' : ''}{change}%
              </span>
              <span style={{ 
                fontSize: tokens.typography.fontSize.xs[0], 
                color: tokens.colors.secondary[500] }}>
                vs last month
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Simple chart components (without external libraries)
const SimpleBarChart = ({ data, color, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value || d.count || 0));
  
  return (
    <div className="bar-chart" style={{ height: `${height}px`, display: 'flex', alignItems: 'flex-end', gap: tokens.spacing[2] }}>
      {data.map((item, index) => {
        const value = item.value || item.count || 0;
        const heightPercent = (value / maxValue) * 100;
        
        return (
          <div
            key={index}
            className="bar-container"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div
              className="bar"
              style={{
                width: '100%',
                height: `${heightPercent}%`,
                backgroundColor: color,
                borderRadius: tokens.borderRadius.sm,
                minHeight: '4px',
                transition: `all ${tokens.animations.duration[300]}`,
              }}
            />
            <div
              className="bar-label"
              style={{
                fontSize: tokens.typography.fontSize.xs[0],
                color: tokens.colors.secondary[600],
                textAlign: 'center',
                marginTop: tokens.spacing[1],
              }}
            >
              {item.label || item.date?.split('-')[1] || ''}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SimpleLineChart = ({ data, color, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value || d.count || 0));
  const points = data.map((item, index) => {
    const value = item.value || item.count || 0;
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (value / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="line-chart" style={{ height: `${height}px`, position: 'relative' }}>
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <line
            key={percent}
            x1="0"
            y1={`${percent}%`}
            x2="100%"
            y2={`${percent}%`}
            stroke={tokens.colors.secondary[200]}
            strokeWidth="1"
          />
        ))}
        
        {/* Data line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const value = item.value || item.count || 0;
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (value / maxValue) * 100;
          
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      
      {/* Labels */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        display: 'flex', 
        justifyContent: 'space-between',
        padding: `0 ${tokens.spacing[2]}`,
      }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              fontSize: tokens.typography.fontSize.xs[0],
              color: tokens.colors.secondary[600],
              textAlign: 'center',
            }}
          >
            {item.label || item.date?.split('-')[1] || ''}
          </div>
        ))}
      </div>
    </div>
  );
};

const SimplePieChart = ({ data, height = 200 }) => {
  const total = data.reduce((sum, item) => sum + (item.value || item.count || 0), 0);
  let currentAngle = 0;
  
  const colors = [
    tokens.colors.primary[500],
    tokens.colors.semantic.success[500],
    tokens.colors.semantic.warning[500],
    tokens.colors.semantic.error[500],
    tokens.colors.info[600],
  ];
  
  return (
    <div className="pie-chart" style={{ height: `${height}px`, position: 'relative' }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {data.map((item, index) => {
          const value = item.value || item.count || 0;
          const percentage = (value / total) * 100;
          const angle = (percentage / 100) * 360;
          const endAngle = currentAngle + angle;
          
          const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z',
          ].join(' ');
          
          currentAngle = endAngle;
          
          return (
            <path
              key={index}
              d={pathData}
              fill={colors[index % colors.length]}
              stroke="white"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      
      {/* Legend */}
      <div style={{ 
        position: 'absolute', 
        right: 0, 
        top: '50%', 
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing[2],
      }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2] }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: colors[index % colors.length],
              }}
            />
            <span style={{ 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.secondary[700] 
            }}>
              {item.label || item.stage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Filter panel component
const FilterPanel = ({ filters, onFilterChange, onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="filter-panel" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: tokens.spacing[3], alignItems: 'center' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="filter-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[2],
            padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
            borderRadius: tokens.borderRadius.md,
            border: `1px solid ${tokens.colors.secondary[300]}`,
            backgroundColor: 'white',
            fontSize: tokens.typography.fontSize.sm[0],
            color: tokens.colors.secondary[700],
            cursor: 'pointer',
            transition: `all ${tokens.animations.duration[150]}`,
          }}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
        
        <button
          onClick={onRefresh}
          className="refresh-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[2],
            padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
            borderRadius: tokens.borderRadius.md,
            border: `1px solid ${tokens.colors.secondary[300]}`,
            backgroundColor: 'white',
            fontSize: tokens.typography.fontSize.sm[0],
            color: tokens.colors.secondary[700],
            cursor: 'pointer',
            transition: `all ${tokens.animations.duration[150]}`,
          }}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
        
        <button
          className="export-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[2],
            padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
            borderRadius: tokens.borderRadius.md,
            border: `1px solid ${tokens.colors.secondary[300]}`,
            backgroundColor: 'white',
            fontSize: tokens.typography.fontSize.sm[0],
            color: tokens.colors.secondary[700],
            cursor: 'pointer',
            transition: `all ${tokens.animations.duration[150]}`,
          }}
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
      
      {/* Filter dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: tokens.animations.duration[150] }}
          className="filter-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: tokens.spacing[2],
            backgroundColor: 'white',
            border: `1px solid ${tokens.colors.secondary[200]}`,
            borderRadius: tokens.borderRadius.lg,
            boxShadow: tokens.shadows.lg,
            padding: tokens.spacing[4],
            zIndex: tokens.zIndex.dropdown,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: tokens.spacing[4] }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: tokens.typography.fontSize.sm[0], 
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.secondary[700],
                marginBottom: tokens.spacing[2],
              }}>
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => onFilterChange('dateRange', e.target.value)}
                style={{
                  width: '100%',
                  padding: tokens.spacing[2],
                  borderRadius: tokens.borderRadius.md,
                  border: `1px solid ${tokens.colors.secondary[300]}`,
                  fontSize: tokens.typography.fontSize.sm[0],
                }}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: tokens.typography.fontSize.sm[0], 
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.secondary[700],
                marginBottom: tokens.spacing[2],
              }}>
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => onFilterChange('department', e.target.value)}
                style={{
                  width: '100%',
                  padding: tokens.spacing[2],
                  borderRadius: tokens.borderRadius.md,
                  border: `1px solid ${tokens.colors.secondary[300]}`,
                  fontSize: tokens.typography.fontSize.sm[0],
                }}
              >
                <option value="all">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="product">Product</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Main Analytics Dashboard component
export const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: '30d',
    department: 'all',
  });
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [metricsData, predictionsData] = await Promise.all([
        analyticsService.getMetrics(filters),
        analyticsService.getPredictions(),
      ]);
      
      setMetrics(metricsData);
      setPredictions(predictionsData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
          <p>Loading analytics...</p>
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
        <p>Failed to load analytics data</p>
      </div>
    );
  }
  
  return (
    <div className="analytics-dashboard" style={{ padding: tokens.spacing[6] }}>
      {/* Header */}
      <div style={{ marginBottom: tokens.spacing[6] }}>
        <h1 style={{ 
          fontSize: tokens.typography.fontSize['2xl'][0], 
          fontWeight: tokens.typography.fontWeight.bold,
          color: tokens.colors.secondary[900],
          margin: 0,
        }}>
          Analytics Dashboard
        </h1>
        <p style={{ 
          fontSize: tokens.typography.fontSize.base[0], 
          color: tokens.colors.secondary[600],
          margin: `${tokens.spacing[2]} 0 0 0`,
        }}>
          Comprehensive insights into your hiring performance
        </p>
      </div>
      
      {/* Filters */}
      <div style={{ marginBottom: tokens.spacing[6] }}>
        <FilterPanel 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onRefresh={fetchData}
        />
      </div>
      
      {/* Overview Metrics */}
      <div style={{ marginBottom: tokens.spacing[8] }}>
        <h2 style={{ 
          fontSize: tokens.typography.fontSize.lg[0], 
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.secondary[900],
          marginBottom: tokens.spacing[4],
        }}>
          Overview
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: tokens.spacing[4] 
        }}>
          <MetricCard
            title="Total Jobs"
            value={metrics.overview.totalJobs}
            change={12}
            icon={Briefcase}
            color={tokens.colors.primary[500]}
            subtitle={`${metrics.overview.activeJobs} active`}
          />
          <MetricCard
            title="Applications"
            value={metrics.overview.totalApplications}
            change={23}
            icon={Users}
            color={tokens.colors.semantic.success[500]}
            subtitle={`${metrics.overview.pendingApplications} pending`}
          />
          <MetricCard
            title="Interviews"
            value={metrics.overview.interviewsCompleted}
            change={8}
            icon={Calendar}
            color={tokens.colors.semantic.warning[500]}
            subtitle={`${metrics.overview.interviewsScheduled} scheduled`}
          />
          <MetricCard
            title="Hires"
            value={metrics.overview.offersAccepted}
            change={15}
            icon={Target}
            color={tokens.colors.semantic.error[500]}
            subtitle={`${metrics.overview.offersExtended} offers extended`}
          />
        </div>
      </div>
      
      {/* Charts Section */}
      <div style={{ marginBottom: tokens.spacing[8] }}>
        <h2 style={{ 
          fontSize: tokens.typography.fontSize.lg[0], 
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.secondary[900],
          marginBottom: tokens.spacing[4],
        }}>
          Trends & Patterns
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: tokens.spacing[6] 
        }}>
          {/* Applications Trend */}
          <motion.div
            className="chart-card"
            whileHover={{ y: -2 }}
            style={{
              backgroundColor: 'white',
              borderRadius: tokens.borderRadius.lg,
              padding: tokens.spacing[6],
              border: `1px solid ${tokens.colors.secondary[200]}`,
            }}
          >
            <h3 style={{ 
              fontSize: tokens.typography.fontSize.base[0], 
              fontWeight: tokens.typography.fontWeight.semibold,
              color: tokens.colors.secondary[900],
              marginBottom: tokens.spacing[4],
            }}>
              Applications Trend
            </h3>
            <SimpleLineChart 
              data={metrics.trends.applications} 
              color={tokens.colors.primary[500]}
              height={200}
            />
          </motion.div>
          
          {/* Hiring Funnel */}
          <motion.div
            className="chart-card"
            whileHover={{ y: -2 }}
            style={{
              backgroundColor: 'white',
              borderRadius: tokens.borderRadius.lg,
              padding: tokens.spacing[6],
              border: `1px solid ${tokens.colors.secondary[200]}`,
            }}
          >
            <h3 style={{ 
              fontSize: tokens.typography.fontSize.base[0], 
              fontWeight: tokens.typography.fontWeight.semibold,
              color: tokens.colors.secondary[900],
              marginBottom: tokens.spacing[4],
            }}>
              Hiring Funnel
            </h3>
            <SimpleBarChart 
              data={metrics.funnel} 
              color={tokens.colors.semantic.success[500]}
              height={200}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Department Performance */}
      <div style={{ marginBottom: tokens.spacing[8] }}>
        <h2 style={{ 
          fontSize: tokens.typography.fontSize.lg[0], 
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.secondary[900],
          marginBottom: tokens.spacing[4],
        }}>
          Department Performance
        </h2>
        <motion.div
          className="performance-table"
          whileHover={{ y: -2 }}
          style={{
            backgroundColor: 'white',
            borderRadius: tokens.borderRadius.lg,
            padding: tokens.spacing[6],
            border: `1px solid ${tokens.colors.secondary[200]}`,
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${tokens.colors.secondary[200]}` }}>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: tokens.spacing[3],
                    fontSize: tokens.typography.fontSize.sm[0],
                    fontWeight: tokens.typography.fontWeight.semibold,
                    color: tokens.colors.secondary[700],
                  }}>
                    Department
                  </th>
                  <th style={{ 
                    textAlign: 'right', 
                    padding: tokens.spacing[3],
                    fontSize: tokens.typography.fontSize.sm[0],
                    fontWeight: tokens.typography.fontWeight.semibold,
                    color: tokens.colors.secondary[700],
                  }}>
                    Hires
                  </th>
                  <th style={{ 
                    textAlign: 'right', 
                    padding: tokens.spacing[3],
                    fontSize: tokens.typography.fontSize.sm[0],
                    fontWeight: tokens.typography.fontWeight.semibold,
                    color: tokens.colors.secondary[700],
                  }}>
                    Applications
                  </th>
                  <th style={{ 
                    textAlign: 'right', 
                    padding: tokens.spacing[3],
                    fontSize: tokens.typography.fontSize.sm[0],
                    fontWeight: tokens.typography.fontWeight.semibold,
                    color: tokens.colors.secondary[700],
                  }}>
                    Efficiency
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.departmentPerformance.map((dept, index) => (
                  <tr key={index} style={{ borderBottom: `1px solid ${tokens.colors.secondary[100]}` }}>
                    <td style={{ 
                      padding: tokens.spacing[3],
                      fontSize: tokens.typography.fontSize.sm[0],
                      color: tokens.colors.secondary[900],
                      fontWeight: tokens.typography.fontWeight.medium,
                    }}>
                      {dept.department}
                    </td>
                    <td style={{ 
                      textAlign: 'right',
                      padding: tokens.spacing[3],
                      fontSize: tokens.typography.fontSize.sm[0],
                      color: tokens.colors.secondary[700],
                    }}>
                      {dept.hires}
                    </td>
                    <td style={{ 
                      textAlign: 'right',
                      padding: tokens.spacing[3],
                      fontSize: tokens.typography.fontSize.sm[0],
                      color: tokens.colors.secondary[700],
                    }}>
                      {dept.applications}
                    </td>
                    <td style={{ 
                      textAlign: 'right',
                      padding: tokens.spacing[3],
                      fontSize: tokens.typography.fontSize.sm[0],
                      color: tokens.colors.secondary[700],
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                        borderRadius: tokens.borderRadius.sm,
                        backgroundColor: dept.efficiency >= 80 ? tokens.colors.semantic.success[100] : 
                                       dept.efficiency >= 60 ? tokens.colors.semantic.warning[100] : 
                                       tokens.colors.semantic.error[100],
                        color: dept.efficiency >= 80 ? tokens.colors.semantic.success[700] : 
                               dept.efficiency >= 60 ? tokens.colors.semantic.warning[700] : 
                               tokens.colors.semantic.error[700],
                        fontSize: tokens.typography.fontSize.xs[0],
                        fontWeight: tokens.typography.fontWeight.medium,
                      }}>
                        {dept.efficiency}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      
      {/* Predictions */}
      {predictions && (
        <div>
          <h2 style={{ 
            fontSize: tokens.typography.fontSize.lg[0], 
            fontWeight: tokens.typography.fontWeight.semibold,
            color: tokens.colors.secondary[900],
            marginBottom: tokens.spacing[4],
          }}>
            AI Predictions
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: tokens.spacing[4] 
          }}>
            <motion.div
              className="prediction-card"
              whileHover={{ y: -2 }}
              style={{
                backgroundColor: 'white',
                borderRadius: tokens.borderRadius.lg,
                padding: tokens.spacing[6],
                border: `1px solid ${tokens.colors.secondary[200]}`,
              }}
            >
              <h3 style={{ 
                fontSize: tokens.typography.fontSize.base[0], 
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.secondary[900],
                marginBottom: tokens.spacing[4],
              }}>
                Upcoming Hiring Needs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[3] }}>
                {predictions.hiringNeeds.map((need, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: tokens.spacing[3],
                    backgroundColor: tokens.colors.secondary[50],
                    borderRadius: tokens.borderRadius.md,
                  }}>
                    <div>
                      <div style={{ 
                        fontSize: tokens.typography.fontSize.sm[0], 
                        fontWeight: tokens.typography.fontWeight.medium,
                        color: tokens.colors.secondary[900],
                      }}>
                        {need.department}
                      </div>
                      <div style={{ 
                        fontSize: tokens.typography.fontSize.xs[0], 
                        color: tokens.colors.secondary[600],
                      }}>
                        {need.positions} positions · {need.timeline}
                      </div>
                    </div>
                    <span style={{
                      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                      borderRadius: tokens.borderRadius.sm,
                      backgroundColor: need.priority === 'high' ? tokens.colors.semantic.error[100] :
                                       need.priority === 'medium' ? tokens.colors.semantic.warning[100] :
                                       tokens.colors.semantic.success[100],
                      color: need.priority === 'high' ? tokens.colors.semantic.error[700] :
                             need.priority === 'medium' ? tokens.colors.semantic.warning[700] :
                             tokens.colors.semantic.success[700],
                      fontSize: tokens.typography.fontSize.xs[0],
                      fontWeight: tokens.typography.fontWeight.medium,
                      textTransform: 'uppercase',
                    }}>
                      {need.priority}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="prediction-card"
              whileHover={{ y: -2 }}
              style={{
                backgroundColor: 'white',
                borderRadius: tokens.borderRadius.lg,
                padding: tokens.spacing[6],
                border: `1px solid ${tokens.colors.secondary[200]}`,
              }}
            >
              <h3 style={{ 
                fontSize: tokens.typography.fontSize.base[0], 
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.secondary[900],
                marginBottom: tokens.spacing[4],
              }}>
                Budget Forecast
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[3] }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                }}>
                  <span style={{ 
                    fontSize: tokens.typography.fontSize.sm[0], 
                    color: tokens.colors.secondary[600],
                  }}>
                    Current Quarter
                  </span>
                  <span style={{ 
                    fontSize: tokens.typography.fontSize.base[0], 
                    fontWeight: tokens.typography.fontWeight.bold,
                    color: tokens.colors.secondary[900],
                  }}>
                    ${predictions.budgetForecast.currentQuarter.toLocaleString()}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                }}>
                  <span style={{ 
                    fontSize: tokens.typography.fontSize.sm[0], 
                    color: tokens.colors.secondary[600],
                  }}>
                    Next Quarter
                  </span>
                  <span style={{ 
                    fontSize: tokens.typography.fontSize.base[0], 
                    fontWeight: tokens.typography.fontWeight.bold,
                    color: tokens.colors.secondary[900],
                  }}>
                    ${predictions.budgetForecast.nextQuarter.toLocaleString()}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: tokens.spacing[3],
                  backgroundColor: tokens.colors.semantic.success[50],
                  borderRadius: tokens.borderRadius.md,
                }}>
                  <span style={{ 
                    fontSize: tokens.typography.fontSize.sm[0], 
                    color: tokens.colors.semantic.success[700],
                    fontWeight: tokens.typography.fontWeight.medium,
                  }}>
                    Variance
                  </span>
                  <span style={{ 
                    fontSize: tokens.typography.fontSize.sm[0], 
                    color: tokens.colors.semantic.success[700],
                    fontWeight: tokens.typography.fontWeight.bold,
                  }}>
                    {predictions.budgetForecast.variance}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
