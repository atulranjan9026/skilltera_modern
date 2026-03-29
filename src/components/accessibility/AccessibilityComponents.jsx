import React, { useEffect, useRef, useState } from 'react';
import { tokens } from '../../styles/designTokens';

// Accessibility utilities
export const useAccessibility = () => {
  const [announceMessage, setAnnounceMessage] = useState('');
  const announcementRef = useRef(null);

  // Screen reader announcements
  const announce = (message) => {
    setAnnounceMessage(message);
    // Clear after announcement
    setTimeout(() => setAnnounceMessage(''), 1000);
  };

  // Focus management
  const focusElement = (element) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
      announce(`Focused on ${element.getAttribute('aria-label') || element.textContent || 'element'}`);
    }
  };

  // Keyboard navigation helpers
  const handleKeyDown = (event, handlers = {}) => {
    const { onEnter, onEscape, onArrowUp, onArrowDown, onTab, onSpace } = handlers;
    
    switch (event.key) {
      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter(event);
        }
        break;
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape(event);
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
      case 'Tab':
        if (onTab) {
          onTab(event);
        }
        break;
      case ' ':
        if (onSpace) {
          event.preventDefault();
          onSpace(event);
        }
        break;
    }
  };

  // Color contrast checker
  const checkContrast = (foreground, background) => {
    // Simple contrast ratio calculation
    const getLuminance = (hex) => {
      const rgb = parseInt(hex.replace('#', ''), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };

    const lum1 = getLuminance(foreground);
    const lum2 = getLuminance(background);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  return {
    announce,
    focusElement,
    handleKeyDown,
    checkContrast,
    announcementRef,
  };
};

// Accessible Button Component
export const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  size = 'md',
  ariaLabel,
  ariaDescribedBy,
  className = '',
  ...props 
}) => {
  const getVariantStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: tokens.borderRadius.md,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: `all ${tokens.animations.duration[150]}`,
      fontFamily: tokens.typography.fontFamily.sans,
      fontWeight: tokens.typography.fontWeight.medium,
      position: 'relative',
    };

    const sizeStyles = {
      sm: {
        minHeight: '44px',
        padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
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
        backgroundColor: disabled ? tokens.colors.secondary[300] : tokens.colors.primary[500],
        color: 'white',
      },
      secondary: {
        backgroundColor: disabled ? tokens.colors.secondary[100] : tokens.colors.secondary[100],
        color: disabled ? tokens.colors.secondary[400] : tokens.colors.secondary[900],
        border: `1px solid ${tokens.colors.secondary[300]}`,
      },
      outline: {
        backgroundColor: 'transparent',
        color: disabled ? tokens.colors.secondary[400] : tokens.colors.primary[500],
        border: `2px solid ${disabled ? tokens.colors.secondary[300] : tokens.colors.primary[500]}`,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: disabled ? tokens.colors.secondary[400] : tokens.colors.secondary[700],
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
      style={getVariantStyles()}
      className={`accessible-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Accessible Form Input Component
export const AccessibleInput = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false, 
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  className = '',
  ...props 
}) => {
  const inputRef = useRef(null);

  const getInputStyles = () => {
    return {
      width: '100%',
      padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
      borderRadius: tokens.borderRadius.md,
      border: `2px solid ${error ? tokens.colors.semantic.error[500] : tokens.colors.secondary[300]}`,
      fontSize: tokens.typography.fontSize.base[0],
      color: tokens.colors.secondary[900],
      backgroundColor: disabled ? tokens.colors.secondary[100] : 'white',
      outline: 'none',
      transition: `all ${tokens.animations.duration[150]}`,
    };
  };

  return (
    <div style={{ marginBottom: tokens.spacing[4] }}>
      {label && (
        <label 
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: tokens.typography.fontSize.sm[0],
            fontWeight: tokens.typography.fontWeight.medium,
            color: tokens.colors.secondary[700],
            marginBottom: tokens.spacing[2],
          }}
        >
          {label}
          {required && (
            <span style={{ color: tokens.colors.semantic.error[500], marginLeft: tokens.spacing[1] }}>
              *
            </span>
          )}
        </label>
      )}
      
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={!!error}
        aria-disabled={disabled}
        style={getInputStyles()}
        className={`accessible-input ${className}`}
        {...props}
      />
      
      {error && (
        <div 
          id={ariaDescribedBy}
          role="alert"
          aria-live="polite"
          style={{
            marginTop: tokens.spacing[2],
            fontSize: tokens.typography.fontSize.sm[0],
            color: tokens.colors.semantic.error[600],
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[1],
          }}
        >
          <span aria-hidden="true">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

// Accessible Modal Component
export const AccessibleModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  closeOnEscape = true,
  closeOnBackdrop = true,
  className = '',
  ...props 
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const { announce } = useAccessibility();

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement;
      
      // Focus modal after render
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
        announce(`Modal opened: ${title}`);
      }, 100);
    } else {
      // Restore focus when closing
      setTimeout(() => {
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
        announce(`Modal closed: ${title}`);
      }, 100);
    }
  }, [isOpen, title]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (closeOnEscape && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="accessible-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: tokens.zIndex.modal,
      }}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-jobDescription"
        className={`accessible-modal ${className}`}
        style={{
          backgroundColor: 'white',
          borderRadius: tokens.borderRadius.lg,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: tokens.spacing[6],
          margin: tokens.spacing[4],
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {/* Header */}
        <div style={{ marginBottom: tokens.spacing[4] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h2 id="modal-title" style={{ 
              margin: 0, 
              fontSize: tokens.typography.fontSize.lg[0], 
              fontWeight: tokens.typography.fontWeight.semibold,
              color: tokens.colors.secondary[900],
            }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: 'none',
                border: 'none',
                padding: tokens.spacing[2],
                borderRadius: tokens.borderRadius.sm,
                cursor: 'pointer',
                color: tokens.colors.secondary[500],
                transition: `all ${tokens.animations.duration[150]}`,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div id="modal-jobDescription" style={{ marginBottom: tokens.spacing[4] }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: tokens.spacing[3] }}>
          <AccessibleButton
            onClick={onClose}
            variant="secondary"
            ariaLabel="Cancel"
          >
            Cancel
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
};

// Accessible Navigation Component
export const AccessibleNavigation = ({ items, activeItem, onItemClick }) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const { announce } = useAccessibility();

  const handleKeyDown = (event, index) => {
    const { key } = event;
    
    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = index < items.length - 1 ? index + 1 : 0;
        setFocusedIndex(nextIndex);
        announce(`Navigated to ${items[nextIndex].label}`);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : items.length - 1;
        setFocusedIndex(prevIndex);
        announce(`Navigated to ${items[prevIndex].label}`);
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        announce(`Navigated to ${items[0].label}`);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(items.length - 1);
        announce(`Navigated to ${items[items.length - 1].label}`);
        break;
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing[2],
      }}
    >
      {items.map((item, index) => (
        <button
          key={item.value}
          onClick={() => onItemClick(item.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          aria-current={activeItem === item.value ? 'page' : undefined}
          aria-label={item.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[3],
            padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
            borderRadius: tokens.borderRadius.md,
            border: 'none',
            backgroundColor: activeItem === item.value ? tokens.colors.primary[100] : 'transparent',
            color: activeItem === item.value ? tokens.colors.primary[700] : tokens.colors.secondary[700],
            cursor: 'pointer',
            transition: `all ${tokens.animations.duration[150]}`,
            textAlign: 'left',
            width: '100%',
          }}
          ref={(el) => {
            if (focusedIndex === index && el) {
              el.focus();
            }
          }}
        >
          {item.icon && <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>}
          <span>{item.label}</span>
          {item.badge && (
            <span
              style={{
                backgroundColor: tokens.colors.primary[500],
                color: 'white',
                fontSize: tokens.typography.fontSize.xs[0],
                fontWeight: tokens.typography.fontWeight.bold,
                padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                borderRadius: tokens.borderRadius.sm,
                marginLeft: 'auto',
              }}
              aria-label={`${item.badge} items`}
            >
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};

// Accessible Table Component
export const AccessibleTable = ({ 
  headers, 
  rows, 
  caption, 
  sortable = false, 
  onSort = null 
}) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column) => {
    if (!sortable || !onSort) return;
    
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort(column, newDirection);
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        role="table"
        aria-label={caption}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          borderRadius: tokens.borderRadius.lg,
          overflow: 'hidden',
          border: `1px solid ${tokens.colors.secondary[200]}`,
        }}
      >
        {caption && (
          <caption style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
          }}>
            {caption}
          </caption>
        )}
        
        <thead>
          <tr style={{ backgroundColor: tokens.colors.secondary[50] }}>
            {headers.map((header, index) => (
              <th
                key={header.key}
                scope="col"
                aria-sort={
                  sortable && sortColumn === header.key
                    ? sortDirection === 'asc' ? 'ascending' : 'descending'
                    : 'none'
                }
                style={{
                  padding: tokens.spacing[4],
                  textAlign: 'left',
                  fontSize: tokens.typography.fontSize.sm[0],
                  fontWeight: tokens.typography.fontWeight.semibold,
                  color: tokens.colors.secondary[900],
                  borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
                  cursor: sortable ? 'pointer' : 'default',
                  userSelect: sortable ? 'none' : 'auto',
                }}
                onClick={() => sortable && handleSort(header.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2] }}>
                  {header.label}
                  {sortable && (
                    <span aria-hidden="true">
                      {sortColumn === header.key ? (
                        sortDirection === 'asc' ? ' ↑' : ' ↓'
                      ) : (
                        ' ↕'
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                borderBottom: `1px solid ${tokens.colors.secondary[100]}`,
                transition: `background-color ${tokens.animations.duration[150]}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = tokens.colors.secondary[50];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              {headers.map((header) => (
                <td
                  key={header.key}
                  style={{
                    padding: tokens.spacing[4],
                    fontSize: tokens.typography.fontSize.sm[0],
                    color: tokens.colors.secondary[700],
                  }}
                >
                  {row[header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Skip Link Component
export const SkipLink = ({ targetId, children }) => {
  return (
    <a
      href={`#${targetId}`}
      style={{
        position: 'absolute',
        top: '-40px',
        left: tokens.spacing[4],
        backgroundColor: tokens.colors.primary[500],
        color: 'white',
        padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
        borderRadius: tokens.borderRadius.md,
        textDecoration: 'none',
        fontWeight: tokens.typography.fontWeight.medium,
        zIndex: tokens.zIndex.modal,
        transition: `top ${tokens.animations.duration[150]}`,
      }}
      onFocus={(e) => {
        e.target.style.top = tokens.spacing[4];
      }}
      onBlur={(e) => {
        e.target.style.top = '-40px';
      }}
    >
      {children}
    </a>
  );
};

// Live Region Component
export const LiveRegion = ({ politeness = 'polite', children }) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

// Focus Trap Hook
export const useFocusTrap = (isActive) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};

export default {
  useAccessibility,
  AccessibleButton,
  AccessibleInput,
  AccessibleModal,
  AccessibleNavigation,
  AccessibleTable,
  SkipLink,
  LiveRegion,
  useFocusTrap,
};
