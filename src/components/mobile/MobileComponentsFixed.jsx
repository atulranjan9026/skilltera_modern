import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  Home, 
  Briefcase, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  ChevronRight,
  Plus,
  Filter,
  Download
} from 'lucide-react';
import { tokens, animations } from '../../styles/designTokens';

// Mobile breakpoint hook
export const useMobileBreakpoint = (breakpoint = 'md') => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const breakpointValue = tokens.breakpoints[breakpoint]?.replace('px', '') || 768;
      setIsMobile(width < parseInt(breakpointValue));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
};

// Touch-friendly button component
export const TouchButton = ({ 
  children, 
  icon: Icon, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing[2],
    border: 'none',
    borderRadius: tokens.borderRadius.md,
    cursor: 'pointer',
    transition: `all ${tokens.animations.duration[150]}`,
    fontFamily: tokens.typography.fontFamily.sans,
    fontWeight: tokens.typography.fontWeight.medium,
    position: 'relative',
    overflow: 'hidden',
  };

  const sizeStyles = {
    sm: {
      minHeight: '44px',
      padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
      fontSize: tokens.typography.fontSize.sm[0],
    },
    md: {
      minHeight: '48px',
      padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
      fontSize: tokens.typography.fontSize.base[0],
    },
    lg: {
      minHeight: '52px',
      padding: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
      fontSize: tokens.typography.fontSize.lg[0],
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: tokens.colors.primary[500],
      color: 'white',
    },
    secondary: {
      backgroundColor: tokens.colors.secondary[100],
      color: tokens.colors.secondary[900],
    },
    outline: {
      backgroundColor: 'transparent',
      color: tokens.colors.primary[500],
      border: `2px solid ${tokens.colors.primary[500]}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: tokens.colors.secondary[700],
    },
  };

  const styles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    width: fullWidth ? '100%' : 'auto',
  };

  return (
    <motion.button
      style={styles}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: tokens.animations.duration[100] }}
      className={`touch-button ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 18 : size === 'lg' ? 24 : 20} />}
      {children}
    </motion.button>
  );
};

// Mobile-optimized card component
export const MobileCard = ({ 
  children, 
  title, 
  subtitle, 
  actions = [], 
  onPress = null,
  className = '',
  style = {}
}) => {
  const cardStyles = {
    backgroundColor: 'white',
    borderRadius: tokens.borderRadius.lg,
    border: `1px solid ${tokens.colors.secondary[200]}`,
    overflow: 'hidden',
    ...style,
  };

  const contentStyles = {
    padding: tokens.spacing[4],
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing[3],
  };

  const titleStyles = {
    fontSize: tokens.typography.fontSize.base[0],
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.secondary[900],
    margin: 0,
    lineHeight: tokens.typography.fontSize.base[1],
  };

  const subtitleStyles = {
    fontSize: tokens.typography.fontSize.sm[0],
    color: tokens.colors.secondary[600],
    margin: `${tokens.spacing[1]} 0 0 0`,
    lineHeight: tokens.typography.fontSize.sm[1],
  };

  const actionsStyles = {
    display: 'flex',
    gap: tokens.spacing[2],
  };

  const CardComponent = onPress ? 'button' : 'div';
  const cardProps = onPress ? { onClick: onPress, style: { ...cardStyles, cursor: 'pointer', width: '100%' } } : { style: cardStyles };

  return (
    <motion.div
      whileTap={onPress ? { scale: 0.98 } : {}}
      transition={{ duration: tokens.animations.duration[100] }}
      className={`mobile-card ${className}`}
    >
      <CardComponent {...cardProps}>
        <div style={contentStyles}>
          {(title || subtitle || actions.length > 0) && (
            <div style={headerStyles}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {title && <h3 style={titleStyles}>{title}</h3>}
                {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
              </div>
              {actions.length > 0 && (
                <div style={actionsStyles}>
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: tokens.spacing[2],
                        borderRadius: tokens.borderRadius.sm,
                        cursor: 'pointer',
                        color: tokens.colors.secondary[500],
                        transition: `all ${tokens.animations.duration[150]}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <action.icon size={18} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {children}
        </div>
      </CardComponent>
    </motion.div>
  );
};

// Mobile navigation component
export const MobileNavigation = ({ items, activeItem, onItemClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', value: 'home' },
    { icon: Briefcase, label: 'Jobs', value: 'jobs' },
    { icon: Users, label: 'Applications', value: 'applications' },
    { icon: Calendar, label: 'Interviews', value: 'interviews' },
    { icon: BarChart3, label: 'Analytics', value: 'analytics' },
    { icon: Settings, label: 'Settings', value: 'settings' },
    ...items,
  ];

  const bottomNavItems = navItems.slice(0, 5);
  const menuItems = navItems.slice(5);

  return (
    <>
      {/* Bottom Navigation */}
      <div
        className="mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTop: `1px solid ${tokens.colors.secondary[200]}`,
          zIndex: tokens.zIndex.sticky,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {bottomNavItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onItemClick(item.value)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: `${tokens.spacing[3]} ${tokens.spacing[2]}`,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                transition: `all ${tokens.animations.duration[150]}`,
                color: activeItem === item.value ? tokens.colors.primary[500] : tokens.colors.secondary[500],
              }}
            >
              <item.icon size={20} />
              <span style={{ 
                fontSize: tokens.typography.fontSize.xs[0], 
                marginTop: tokens.spacing[1],
                fontWeight: activeItem === item.value ? tokens.typography.fontWeight.semibold : tokens.typography.fontWeight.normal,
              }}>
                {item.label}
              </span>
            </button>
          ))}
          
          {menuItems.length > 0 && (
            <button
              onClick={() => setIsMenuOpen(true)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: `${tokens.spacing[3]} ${tokens.spacing[2]}`,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                transition: `all ${tokens.animations.duration[150]}`,
                color: tokens.colors.secondary[500],
              }}
            >
              <Menu size={20} />
              <span style={{ 
                fontSize: tokens.typography.fontSize.xs[0], 
                marginTop: tokens.spacing[1],
              }}>
                More
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: tokens.animations.duration[200] }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: tokens.zIndex.overlay,
              }}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: tokens.animations.duration[300], ease: 'easeInOut' }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '300px',
                backgroundColor: 'white',
                zIndex: tokens.zIndex.modal,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Menu Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: tokens.spacing[4],
                  borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
                }}
              >
                <h2 style={{ 
                  margin: 0, 
                  fontSize: tokens.typography.fontSize.lg[0], 
                  fontWeight: tokens.typography.fontWeight.semibold,
                  color: tokens.colors.secondary[900],
                }}>
                  Menu
                </h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: tokens.spacing[2],
                    borderRadius: tokens.borderRadius.sm,
                    cursor: 'pointer',
                    color: tokens.colors.secondary[500],
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Items */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {menuItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      onItemClick(item.value);
                      setIsMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: tokens.spacing[3],
                      width: '100%',
                      padding: tokens.spacing[4],
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      transition: `all ${tokens.animations.duration[150]}`,
                      color: activeItem === item.value ? tokens.colors.primary[500] : tokens.colors.secondary[700],
                      backgroundColor: activeItem === item.value ? tokens.colors.primary[50] : 'transparent',
                    }}
                  >
                    <item.icon size={20} />
                    <span style={{ 
                      fontSize: tokens.typography.fontSize.base[0],
                      fontWeight: activeItem === item.value ? tokens.typography.fontWeight.semibold : tokens.typography.fontWeight.normal,
                    }}>
                      {item.label}
                    </span>
                    <ChevronRight size={16} style={{ marginLeft: 'auto' }} />
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Mobile list component
export const MobileList = ({ 
  items, 
  emptyMessage = 'No items found', 
  loading = false,
  onRefresh = null,
  onEndReached = null,
  renderItem = null 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const listRef = useRef(null);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleScroll = () => {
    if (onEndReached && listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onEndReached();
      }
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: tokens.spacing[8],
        color: tokens.colors.secondary[500],
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ 
            width: '32px', 
            height: '32px', 
            border: `3px solid ${tokens.colors.secondary[200]}`,
            borderTop: `3px solid ${tokens.colors.primary[500]}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto ' + tokens.spacing[3],
          }} />
          <p style={{ fontSize: tokens.typography.fontSize.sm[0] }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: tokens.spacing[8],
        color: tokens.colors.secondary[500],
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: tokens.typography.fontSize['4xl'][0], 
            marginBottom: tokens.spacing[3],
            opacity: 0.5,
          }}>
            📭
          </div>
          <p style={{ fontSize: tokens.typography.fontSize.sm[0] }}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      style={{
        height: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Pull to refresh indicator */}
      {isRefreshing && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: tokens.spacing[3],
          color: tokens.colors.primary[500],
        }}>
          <div className="loading-spinner" style={{ 
            width: '20px', 
            height: '20px', 
            border: `2px solid ${tokens.colors.primary[200]}`,
            borderTop: `2px solid ${tokens.colors.primary[500]}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: tokens.spacing[2],
          }} />
          <span style={{ fontSize: tokens.typography.fontSize.sm[0] }}>Refreshing...</span>
        </div>
      )}

      {/* List items */}
      <div style={{ padding: tokens.spacing[4] }}>
        {items.map((item, index) => (
          <div key={item.id || index} style={{ marginBottom: tokens.spacing[3] }}>
            {renderItem ? renderItem(item, index) : (
              <MobileCard
                title={item.title}
                subtitle={item.subtitle}
                actions={item.actions || []}
                onPress={item.onPress}
              >
                {item.content}
              </MobileCard>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default {
  useMobileBreakpoint,
  TouchButton,
  MobileCard,
  MobileNavigation,
  MobileList,
};
