import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target, 
  Users, 
  Briefcase, 
  DollarSign, 
  Zap, 
  Lightbulb, 
  BarChart3,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { tokens, animations } from '../../styles/designTokens';

// AI Insights Service
const aiInsightsService = {
  generateInsights: async (companyData) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      hiringTrends: {
        status: 'positive',
        trend: 'increasing',
        change: '+23%',
        insight: 'Your hiring velocity has increased by 23% this month, indicating improved recruitment efficiency.',
        recommendations: [
          'Maintain current sourcing strategies',
          'Consider expanding to new channels',
          'Optimize interview scheduling process',
        ],
      },
      candidateQuality: {
        status: 'warning',
        trend: 'decreasing',
        change: '-12%',
        insight: 'Candidate quality scores have decreased by 12% over the past quarter. Review job descriptions and sourcing criteria.',
        recommendations: [
          'Refine job requirements and descriptions',
          'Improve sourcing channels',
          'Enhance screening process',
        ],
      },
      timeToHire: {
        status: 'positive',
        trend: 'improving',
        change: '-18%',
        insight: 'Average time to hire has reduced by 18% from 45 to 37 days. Your process optimization is working well.',
        recommendations: [
          'Document successful process changes',
          'Apply similar optimizations to other roles',
          'Monitor for consistency',
        ],
      },
      costPerHire: {
        status: 'neutral',
        trend: 'stable',
        change: '+2%',
        insight: 'Cost per hire remains stable at $4,500, which is within industry benchmarks for your sector.',
        recommendations: [
          'Explore cost-effective sourcing channels',
          'Implement employee referral programs',
          'Optimize advertising spend',
        ],
      },
      predictiveAnalytics: {
        nextQuarterHiring: {
          forecast: 28,
          confidence: 85,
          departments: {
            'Engineering': 12,
            'Sales': 8,
            'Marketing': 5,
            'Product': 3,
          },
        },
        skillGaps: [
          { skill: 'React/Next.js', urgency: 'high', impact: 'critical' },
          { skill: 'Data Analysis', urgency: 'medium', impact: 'high' },
          { skill: 'Cloud Architecture', urgency: 'low', impact: 'medium' },
        ],
        marketTrends: {
          demandIncrease: '+15%',
          salaryInflation: '+6%',
          competitionLevel: 'high',
        },
      },
    };
  },
  
  analyzeCandidate: async (candidateData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      matchScore: 87,
      strengths: [
        'Strong technical background',
        'Relevant industry experience',
        'Good cultural fit indicators',
      ],
      concerns: [
        'Limited leadership experience',
        'Salary expectations above range',
      ],
      recommendations: [
        'Consider for senior technical role',
        'Discuss career growth opportunities',
        'Evaluate total compensation package',
      ],
      riskLevel: 'low',
    };
  },
};

// Insight Card Component
const InsightCard = ({ 
  title, 
  status, 
  trend, 
  change, 
  insight, 
  recommendations, 
  icon: Icon,
  onAction 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'positive': return tokens.colors.semantic.success[500];
      case 'warning': return tokens.colors.semantic.warning[500];
      case 'negative': return tokens.colors.semantic.error[500];
      default: return tokens.colors.secondary[500];
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return <TrendingUp size={16} />;
      case 'decreasing':
      case 'declining':
        return <TrendingDown size={16} />;
      default:
        return <div style={{ width: '16px', height: '16px' }} />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return tokens.colors.semantic.success[500];
      case 'decreasing':
      case 'declining':
        return tokens.colors.semantic.error[500];
      default:
        return tokens.colors.secondary[500];
    }
  };

  return (
    <motion.div
      className="insight-card"
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
      {/* Status indicator */}
      <div
        className="status-indicator"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: getStatusColor(status),
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: tokens.spacing[4], marginBottom: tokens.spacing[4] }}>
        <div
          className="icon-container"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: tokens.borderRadius.lg,
            backgroundColor: `${getStatusColor(status)}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon style={{ color: getStatusColor(status), width: '24px', height: '24px' }} />
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: tokens.typography.fontSize.base[0], 
            fontWeight: tokens.typography.fontWeight.semibold,
            color: tokens.colors.secondary[900],
            marginBottom: tokens.spacing[2],
          }}>
            {title}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1] }}>
              {getTrendIcon(trend)}
              <span style={{ 
                fontSize: tokens.typography.fontSize.sm[0], 
                fontWeight: tokens.typography.fontWeight.medium,
                color: getTrendColor(trend),
              }}>
                {change}
              </span>
            </div>
            <span style={{ 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.secondary[500],
            }}>
              vs last period
            </span>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div style={{ 
        padding: tokens.spacing[4],
        backgroundColor: tokens.colors.secondary[50],
        borderRadius: tokens.borderRadius.md,
        marginBottom: tokens.spacing[4],
      }}>
        <p style={{ 
          margin: 0, 
          fontSize: tokens.typography.fontSize.sm[0], 
          color: tokens.colors.secondary[700],
          lineHeight: tokens.typography.fontSize.sm[1],
        }}>
          {insight}
        </p>
      </div>

      {/* Recommendations */}
      <div>
        <h4 style={{ 
          margin: 0, 
          fontSize: tokens.typography.fontSize.sm[0], 
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.secondary[900],
          marginBottom: tokens.spacing[3],
        }}>
          AI Recommendations
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
          {recommendations.map((rec, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: tokens.spacing[2] }}>
              <Lightbulb size={16} style={{ 
                color: tokens.colors.primary[500], 
                flexShrink: 0,
                marginTop: tokens.spacing[1],
              }} />
              <span style={{ 
                fontSize: tokens.typography.fontSize.sm[0], 
                color: tokens.colors.secondary[700],
                lineHeight: tokens.typography.fontSize.sm[1],
              }}>
                {rec}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action button */}
      {onAction && (
        <div style={{ marginTop: tokens.spacing[4] }}>
          <button
            onClick={onAction}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing[2],
              padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
              borderRadius: tokens.borderRadius.md,
              border: `1px solid ${tokens.colors.primary[500]}`,
              backgroundColor: 'transparent',
              color: tokens.colors.primary[500],
              fontSize: tokens.typography.fontSize.sm[0],
              fontWeight: tokens.typography.fontWeight.medium,
              cursor: 'pointer',
              transition: `all ${tokens.animations.duration[150]}`,
            }}
          >
            <Eye size={16} />
            View Details
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Predictive Analytics Component
const PredictiveAnalytics = ({ data }) => {
  return (
    <motion.div
      className="predictive-analytics"
      whileHover={{ y: -2 }}
      style={{
        backgroundColor: 'white',
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing[6],
        border: `1px solid ${tokens.colors.secondary[200]`,
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
        <Brain size={20} style={{ color: tokens.colors.primary[500] }} />
        Predictive Analytics
      </h3>

      {/* Hiring Forecast */}
      <div style={{ marginBottom: tokens.spacing[6] }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: tokens.typography.fontSize.base[0], 
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.secondary[900],
          marginBottom: tokens.spacing[3],
        }}>
          Next Quarter Hiring Forecast
        </h4>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: tokens.spacing[4],
          padding: tokens.spacing[4],
          backgroundColor: tokens.colors.primary[50],
          borderRadius: tokens.borderRadius.md,
          marginBottom: tokens.spacing[3],
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: tokens.typography.fontSize['3xl'][0], 
              fontWeight: tokens.typography.fontWeight.bold,
              color: tokens.colors.primary[600],
            }}>
              {insights.nextQuarterHiring.forecast}
            </div>
            <div style={{ 
              fontSize: tokens.typography.fontSize.sm[0], 
              color: tokens.colors.primary[600],
            }}>
              Positions
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: tokens.typography.fontSize.sm[0], 
              color: tokens.colors.secondary[600],
              marginBottom: tokens.spacing[1],
            }}>
              Confidence Level
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: tokens.spacing[2],
            }}>
              <div style={{ 
                flex: 1, 
                height: '8px', 
                backgroundColor: tokens.colors.secondary[200],
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{ 
                  width: insights.nextQuarterHiring.confidence + '%',
                  height: '100%',
                  backgroundColor: tokens.colors.primary[500],
                }} />
              </div>
              <span style={{ 
                fontSize: tokens.typography.fontSize.sm[0], 
                fontWeight: tokens.typography.fontWeight.medium,
                color: tokens.colors.secondary[700],
              }}>
                {insights.nextQuarterHiring.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Department breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: tokens.spacing[3] }}>
          {Object.entries(insights.nextQuarterHiring.departments).map(([dept, count]) => (
            <div key={dept} style={{ 
              textAlign: 'center',
              padding: tokens.spacing[3],
              backgroundColor: tokens.colors.secondary[50],
              borderRadius: tokens.borderRadius.md,
            }}>
              <div style={{ 
                fontSize: tokens.typography.fontSize.lg[0], 
                fontWeight: tokens.typography.fontWeight.bold,
                color: tokens.colors.secondary[900],
              }}>
                {count}
              </div>
              <div style={{ 
                fontSize: tokens.typography.fontSize.xs[0], 
                color: tokens.colors.secondary[600],
              }}>
                {dept}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gaps */}
      <div style={{ marginBottom: tokens.spacing[6] }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: tokens.typography.fontSize.base[0], 
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.secondary[900],
          marginBottom: tokens.spacing[3],
        }}>
          Identified Skill Gaps
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
          {insights.skillGaps.map((skill, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: tokens.spacing[3],
              backgroundColor: tokens.colors.secondary[50],
              borderRadius: tokens.borderRadius.md,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3] }}>
                <AlertTriangle size={16} style={{ 
                  color: skill.urgency === 'high' ? tokens.colors.semantic.error[500] :
                         skill.urgency === 'medium' ? tokens.colors.semantic.warning[500] :
                         tokens.colors.semantic.success[500],
                }} />
                <span style={{ 
                  fontSize: tokens.typography.fontSize.sm[0], 
                  fontWeight: tokens.typography.fontWeight.medium,
                  color: tokens.colors.secondary[900],
                }}>
                  {skill.skill}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2] }}>
                <span style={{ 
                  fontSize: tokens.typography.fontSize.xs[0], 
                  padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                  borderRadius: tokens.borderRadius.sm,
                  backgroundColor: skill.urgency === 'high' ? tokens.colors.semantic.error[100] :
                                 skill.urgency === 'medium' ? tokens.colors.semantic.warning[100] :
                                 tokens.colors.semantic.success[100],
                  color: skill.urgency === 'high' ? tokens.colors.semantic.error[700] :
                         skill.urgency === 'medium' ? tokens.colors.semantic.warning[700] :
                         tokens.colors.semantic.success[700],
                  textTransform: 'uppercase',
                  fontWeight: tokens.typography.fontWeight.medium,
                }}>
                  {skill.urgency}
                </span>
                <span style={{ 
                  fontSize: tokens.typography.fontSize.xs[0], 
                  color: tokens.colors.secondary[500],
                }}>
                  Impact: {skill.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Trends */}
      <div>
        <h4 style={{ 
          margin: 0, 
          fontSize: tokens.typography.fontSize.base[0], 
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.secondary[900],
          marginBottom: tokens.spacing[3],
        }}>
          Market Trends
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: tokens.spacing[3] }}>
          <div style={{ 
            textAlign: 'center',
            padding: tokens.spacing[3],
            backgroundColor: tokens.colors.semantic.success[50],
            borderRadius: tokens.borderRadius.md,
          }}>
            <TrendingUp size={20} style={{ 
              color: tokens.colors.semantic.success[500], 
              marginBottom: tokens.spacing[2] 
            }} />
            <div style={{ 
              fontSize: tokens.typography.fontSize.lg[0], 
              fontWeight: tokens.typography.fontWeight.bold,
              color: tokens.colors.semantic.success[700],
            }}>
              {insights.marketTrends.demandIncrease}
            </div>
            <div style={{ 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.semantic.success[600],
            }}>
              Demand Increase
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            padding: tokens.spacing[3],
            backgroundColor: tokens.colors.semantic.warning[50],
            borderRadius: tokens.borderRadius.md,
          }}>
            <DollarSign size={20} style={{ 
              color: tokens.colors.semantic.warning[500], 
              marginBottom: tokens.spacing[2] 
            }} />
            <div style={{ 
              fontSize: tokens.typography.fontSize.lg[0], 
              fontWeight: tokens.typography.fontWeight.bold,
              color: tokens.colors.semantic.warning[700],
            }}>
              {insights.marketTrends.salaryInflation}
            </div>
            <div style={{ 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.semantic.warning[600],
            }}>
              Salary Inflation
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            padding: tokens.spacing[3],
            backgroundColor: tokens.colors.semantic.error[50],
            borderRadius: tokens.borderRadius.md,
          }}>
            <Users size={20} style={{ 
              color: tokens.colors.semantic.error[500], 
              marginBottom: tokens.spacing[2] 
            }} />
            <div style={{ 
              fontSize: tokens.typography.fontSize.lg[0], 
              fontWeight: tokens.typography.fontWeight.bold,
              color: tokens.colors.semantic.error[700],
              textTransform: 'capitalize',
            }}>
              {insights.marketTrends.competitionLevel}
            </div>
            <div style={{ 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.semantic.error[600],
            }}>
              Competition
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main AI Insights Component
export const AIInsightsDashboard = ({ companyData }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [feedback, setFeedback] = useState({});

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const data = await aiInsightsService.generateInsights(companyData);
      setInsights(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [companyData]);

  const handleFeedback = (insightId, isHelpful) => {
    setFeedback(prev => ({ ...prev, [insightId]: isHelpful }));
    // In a real app, this would send feedback to the backend
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
          <Brain className="w-8 h-8 animate-pulse" style={{ margin: '0 auto', marginBottom: tokens.spacing[3] }} />
          <p style={{ fontSize: tokens.typography.fontSize.sm[0] }}>AI is analyzing your insights...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: tokens.colors.secondary[500],
      }}>
        <p>Failed to load AI insights</p>
      </div>
    );
  }

  return (
    <div className="ai-insights-dashboard" style={{ padding: tokens.spacing[6] }}>
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
            <Brain style={{ color: tokens.colors.primary[500] }} />
            AI-Powered Hiring Insights
          </h1>
          <p style={{ 
            fontSize: tokens.typography.fontSize.base[0], 
            color: tokens.colors.secondary[600],
            margin: `${tokens.spacing[2]} 0 0 0`,
          }}>
            Intelligent analysis and recommendations for your hiring process
          </p>
          {lastUpdated && (
            <p style={{ 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.secondary[500],
              margin: `${tokens.spacing[1]} 0 0 0`,
            }}>
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        
        <button
          onClick={fetchInsights}
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
          Refresh Insights
        </button>
      </div>

      {/* Insights Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: tokens.spacing[6],
        marginBottom: tokens.spacing[6],
      }}>
        <InsightCard
          title="Hiring Trends"
          status={insights.hiringTrends.status}
          trend={insights.hiringTrends.trend}
          change={insights.hiringTrends.change}
          insight={insights.hiringTrends.insight}
          recommendations={insights.hiringTrends.recommendations}
          icon={TrendingUp}
        />
        
        <InsightCard
          title="Candidate Quality"
          status={insights.candidateQuality.status}
          trend={insights.candidateQuality.trend}
          change={insights.candidateQuality.change}
          insight={insights.candidateQuality.insight}
          recommendations={insights.candidateQuality.recommendations}
          icon={Users}
        />
        
        <InsightCard
          title="Time to Hire"
          status={insights.timeToHire.status}
          trend={insights.timeToHire.trend}
          change={insights.timeToHire.change}
          insight={insights.timeToHire.insight}
          recommendations={insights.timeToHire.recommendations}
          icon={Clock}
        />
        
        <InsightCard
          title="Cost per Hire"
          status={insights.costPerHire.status}
          trend={insights.costPerHire.trend}
          change={insights.costPerHire.change}
          insight={insights.costPerHire.insight}
          recommendations={insights.costPerHire.recommendations}
          icon={DollarSign}
        />
      </div>

      {/* Predictive Analytics */}
      <PredictiveAnalytics data={insights.predictiveAnalytics} />

      {/* Feedback Section */}
      <div style={{ 
        marginTop: tokens.spacing[8],
        padding: tokens.spacing[4],
        backgroundColor: tokens.colors.secondary[50],
        borderRadius: tokens.borderRadius.lg,
        textAlign: 'center',
      }}>
        <p style={{ 
          fontSize: tokens.typography.fontSize.sm[0], 
          color: tokens.colors.secondary[600],
          margin: 0,
        }}>
          💡 Help us improve these AI insights with your feedback
        </p>
      </div>
    </div>
  );
};

export default AIInsightsDashboard;
