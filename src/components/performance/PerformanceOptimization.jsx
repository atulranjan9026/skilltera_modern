import React, { Suspense, lazy, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { tokens, animations } from '../../styles/designTokens';

// Lazy Loading Components
const LazyComponentLoader = ({ fallback, children }) => {
  return (
    <Suspense
      fallback={
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
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
      }
    >
      {children}
    </Suspense>
  );
};

// Intersection Observer Hook for Lazy Loading
export const useIntersectionObserver = (options = {}) => {
  const [entries, setEntries] = useState([]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef();

  const ref = useCallback((node) => {
    if (node) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const isIntersecting = entries.some(entry => entry.isIntersecting);
          setIsIntersecting(isIntersecting);
          setEntries(entries);
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
          ...options,
        }
      );
      observerRef.current.observe(node);
    } else if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  return { ref, entries, isIntersecting };
};

// Image Lazy Loading Component
export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.jpg',
  style = {},
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  const { ref: inViewRef } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  });

  useEffect(() => {
    if (inViewRef.current) {
      inViewRef.current = imgRef.current;
    }
  }, [inViewRef]);

  useEffect(() => {
    if (isInView && imgRef.current && !isLoaded && !error) {
      const img = imgRef.current;
      img.src = src;
    }
  }, [isInView, isLoaded, error, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
    onError?.();
  };

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: tokens.colors.secondary[100],
        ...style,
      }}
      {...props}
    >
      <img
        src={isInView ? (error ? placeholder : src) : placeholder}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: `opacity ${tokens.animations.duration[300]}`,
          opacity: isLoaded ? 1 : 0.7,
        }}
      />
      
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.colors.secondary[100],
          }}
        >
          <div className="loading-spinner" style={{
            width: '24px',
            height: '24px',
            border: `2px solid ${tokens.colors.secondary[200]}`,
            borderTop: `2px solid ${tokens.colors.primary[500]}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      )}
    </div>
  );
};

// Virtual List Component for Large Datasets
export const VirtualList = ({ 
  items, 
  itemHeight = 60, 
  containerHeight = 400, 
  renderItem,
  overscan = 5,
  className = '',
  style = {}
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: containerHeight });
  const containerRef = useRef();

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerSize.height) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerSize.height, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setContainerSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });
      resizeObserver.observe(container);
      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`virtual-list ${className}`}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
        ...style,
      }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: items.length * itemHeight,
          position: 'relative',
        }}
      >
        <div
          style={{
            transform: `translateY(${visibleRange.startIndex * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.startIndex + index}
              style={{
                height: itemHeight,
              }}
            >
              {renderItem(item, visibleRange.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Infinite Scroll Component
export const InfiniteScroll = ({ 
  children, 
  hasNextPage, 
  isNextPageLoading, 
  onLoadMore, 
  threshold = 100,
  className = '',
  style = {}
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { ref } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: `${threshold}px`,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isNextPageLoading) {
      onLoadMore();
    }
  }, [isIntersecting, hasNextPage, isNextPageLoading, onLoadMore]);

  return (
    <div className={`infinite-scroll ${className}`} style={style}>
      {children}
      
      {hasNextPage && (
        <div
          ref={ref}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: tokens.spacing[4],
          }}
        >
          {isNextPageLoading ? (
            <div className="loading-spinner" style={{
              width: '32px',
              height: '32px',
              border: `3px solid ${tokens.colors.secondary[200]}`,
              borderTop: `3px solid ${tokens.colors.primary[500]}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          ) : (
            <div style={{
              fontSize: tokens.typography.fontSize.sm[0],
              color: tokens.colors.secondary[500],
            }}>
              Scroll to load more
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Code Splitting Hook
export const useLazyComponent = (importFunc, dependencies = []) => {
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    importFunc()
      .then((module) => {
        setComponent(() => module.default || module);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, dependencies);

  return { Component, isLoading, error };
};

// Performance Monitoring Hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    componentCount: 0,
    memoryUsage: 0,
  });

  const measureRender = useCallback((name, fn) => {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      renderTime: prev.renderTime + (endTime - startTime),
      componentCount: prev.componentCount + 1,
    }));
    
    return result;
  }, []);

  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = performance.memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // Convert to MB
      }));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(getMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, [getMemoryUsage]);

  return { metrics, measureRender, getMemoryUsage };
};

// Optimized List Component with Memoization
export const OptimizedList = React.memo(({ 
  items, 
  renderItem, 
  keyExtractor,
  emptyMessage = 'No items found',
  className = '',
  style = {}
}) => {
  const memoizedItems = useMemo(() => items, [items]);
  const memoizedRenderItem = useCallback(renderItem, [renderItem]);

  if (memoizedItems.length === 0) {
    return (
      <div
        className={`optimized-list-empty ${className}`}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: tokens.spacing[8],
          color: tokens.colors.secondary[500],
          ...style,
        }}
      >
        <p style={{ fontSize: tokens.typography.fontSize.sm[0] }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={`optimized-list ${className}`} style={style}>
      {memoizedItems.map((item, index) => (
        <div key={keyExtractor(item, index)}>
          {memoizedRenderItem(item, index)}
        </div>
      ))}
    </div>
  );
});

// Debounce Hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle Hook
export const useThrottle = (value, delay) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledValue(value);
      lastExecuted.current = Date.now();
    }, delay - (Date.now() - lastExecuted.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};

// Cache Hook
export const useCache = (defaultTTL = 5 * 60 * 1000) => { // 5 minutes default TTL
  const cache = useRef(new Map());

  const set = useCallback((key, value, ttl = defaultTTL) => {
    const expiry = Date.now() + ttl;
    cache.current.set(key, { value, expiry });
  }, [defaultTTL]);

  const get = useCallback((key) => {
    const item = cache.current.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      cache.current.delete(key);
      return null;
    }
    
    return item.value;
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  const size = useCallback(() => {
    return cache.current.size;
  }, []);

  return { set, get, clear, size };
};

// Image Preloader Component
export const ImagePreloader = ({ images }) => {
  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  return null;
};

// Bundle Size Monitor
export const BundleSizeMonitor = () => {
  const [bundleSize, setBundleSize] = useState(null);

  useEffect(() => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const entries = performance.getEntriesByType('navigation');
      if (entries.length > 0) {
        const entry = entries[0];
        setBundleSize({
          transferSize: entry.transferSize,
          encodedBodySize: entry.encodedBodySize,
          decodedBodySize: entry.decodedBodySize,
        });
      }
    }
  }, []);

  if (!bundleSize) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: tokens.spacing[4],
        right: tokens.spacing[4],
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: tokens.spacing[2],
        borderRadius: tokens.borderRadius.md,
        fontSize: tokens.typography.fontSize.xs[0],
        zIndex: tokens.zIndex.modal,
      }}
    >
      <div>Bundle: {(bundleSize.transferSize / 1024).toFixed(1)}KB</div>
      <div>Decoded: {(bundleSize.decodedBodySize / 1024).toFixed(1)}KB</div>
    </div>
  );
};

// Performance Optimizer HOC
export const withPerformanceOptimization = (WrappedComponent) => {
  const OptimizedComponent = React.memo((props) => {
    const { measureRender } = usePerformanceMonitor();

    return measureRender(WrappedComponent.displayName || 'Component', () => (
      <WrappedComponent {...props} />
    ));
  });

  OptimizedComponent.displayName = `withPerformanceOptimization(${WrappedComponent.displayName || 'Component'})`;
  
  return OptimizedComponent;
};

// Lazy Route Wrapper
export const LazyRoute = ({ importFunc, ...props }) => {
  const LazyComponent = lazy(importFunc);

  return (
    <LazyComponentLoader>
      <LazyComponent {...props} />
    </LazyComponentLoader>
  );
};

// Resource Preloader
export const ResourcePreloader = ({ resources }) => {
  useEffect(() => {
    resources.forEach(resource => {
      if (resource.type === 'image') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = resource.url;
        document.head.appendChild(link);
      } else if (resource.type === 'script') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = resource.url;
        document.head.appendChild(link);
      } else if (resource.type === 'style') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource.url;
        document.head.appendChild(link);
      }
    });
  }, [resources]);

  return null;
};

// Service Worker Manager
export const useServiceWorker = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          // SW registered
          setIsRegistered(true);
        })
        .catch((error) => {
          // SW registration failed
        });
    }
  }, []);

  return { isSupported, isRegistered };
};

export default {
  LazyComponentLoader,
  useIntersectionObserver,
  LazyImage,
  VirtualList,
  InfiniteScroll,
  useLazyComponent,
  usePerformanceMonitor,
  OptimizedList,
  useDebounce,
  useThrottle,
  useCache,
  ImagePreloader,
  BundleSizeMonitor,
  withPerformanceOptimization,
  LazyRoute,
  ResourcePreloader,
  useServiceWorker,
};
