import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, User, Briefcase, Building2, MessageSquare, Calendar, Filter, ChevronDown } from 'lucide-react';
import { tokens, animations } from '../../styles/designTokens';

// Search result types
export const SEARCH_TYPES = {
  JOB: 'job',
  APPLICATION: 'application',
  INTERVIEW: 'interview',
  CANDIDATE: 'candidate',
  TEAM_MEMBER: 'team_member',
  COMPANY: 'company',
  MESSAGE: 'message',
};

// Search filters
export const SEARCH_FILTERS = {
  ALL: 'all',
  JOBS: 'jobs',
  APPLICATIONS: 'applications',
  INTERVIEWS: 'interviews',
  CANDIDATES: 'candidates',
  TEAM: 'team',
  MESSAGES: 'messages',
};

// Mock search service
const searchService = {
  search: async (query, filters = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock search results based on query
    const results = [];
    
    if (query.length > 0) {
      // Job results
      if (filters.type === 'all' || filters.type === 'jobs') {
        results.push(
          {
            id: 'job-1',
            type: SEARCH_TYPES.JOB,
            title: 'Senior Frontend Developer',
            subtitle: 'Engineering Department',
            description: 'Looking for an experienced frontend developer with React expertise',
            relevance: 95,
            metadata: {
              status: 'active',
              applications: 24,
              posted: '2 days ago',
            },
          },
          {
            id: 'job-2',
            type: SEARCH_TYPES.JOB,
            title: 'Product Manager',
            subtitle: 'Product Team',
            description: 'Strategic product manager for our core platform',
            relevance: 85,
            metadata: {
              status: 'active',
              applications: 18,
              posted: '1 week ago',
            },
          }
        );
      }
      
      // Application results
      if (filters.type === 'all' || filters.type === 'applications') {
        results.push(
          {
            id: 'app-1',
            type: SEARCH_TYPES.APPLICATION,
            title: 'John Doe',
            subtitle: 'Senior Frontend Developer',
            description: '5+ years of React experience, previously at Google',
            relevance: 90,
            metadata: {
              status: 'shortlisted',
              applied: '3 days ago',
              score: 85,
            },
          },
          {
            id: 'app-2',
            type: SEARCH_TYPES.APPLICATION,
            title: 'Jane Smith',
            subtitle: 'Product Manager',
            description: '8 years of product management experience',
            relevance: 88,
            metadata: {
              status: 'interview',
              applied: '1 week ago',
              score: 92,
            },
          }
        );
      }
      
      // Team member results
      if (filters.type === 'all' || filters.type === 'team') {
        results.push(
          {
            id: 'team-1',
            type: SEARCH_TYPES.TEAM_MEMBER,
            title: 'Sarah Johnson',
            subtitle: 'Senior HR Manager',
            description: 'Leading the recruitment team',
            relevance: 80,
            metadata: {
              role: 'hiring_manager',
              department: 'HR',
              active: true,
            },
          }
        );
      }
    }
    
    return results;
  },
  
  getSearchHistory: () => {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
  },
  
  saveSearchHistory: (query) => {
    const history = searchService.getSearchHistory();
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  },
  
  getSearchSuggestions: (query) => {
    const suggestions = [
      'React Developer',
      'Frontend Engineer',
      'Product Manager',
      'Senior Developer',
      'UX Designer',
      'Data Scientist',
      'DevOps Engineer',
      'Marketing Manager',
    ];
    
    return suggestions.filter(s => 
      s.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  },
};

// Search result component
const SearchResult = ({ result, onSelect, isSelected }) => {
  const getIcon = (type) => {
    switch (type) {
      case SEARCH_TYPES.JOB:
        return <Briefcase className="w-4 h-4" />;
      case SEARCH_TYPES.APPLICATION:
        return <User className="w-4 h-4" />;
      case SEARCH_TYPES.INTERVIEW:
        return <Calendar className="w-4 h-4" />;
      case SEARCH_TYPES.TEAM_MEMBER:
        return <Building2 className="w-4 h-4" />;
      case SEARCH_TYPES.MESSAGE:
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return tokens.colors.semantic.success[500];
      case 'shortlisted':
        return tokens.colors.semantic.info[500];
      case 'interview':
        return tokens.colors.semantic.warning[500];
      default:
        return tokens.colors.secondary[500];
    }
  };
  
  return (
    <motion.div
      className={`search-result ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(result)}
      whileHover={{ backgroundColor: tokens.colors.secondary[50] }}
      transition={{ duration: tokens.animations.duration[150] }}
      style={{
        padding: tokens.spacing[3],
        borderRadius: tokens.borderRadius.md,
        cursor: 'pointer',
        borderLeft: `3px solid ${getStatusColor(result.metadata?.status)}`,
        backgroundColor: isSelected ? tokens.colors.secondary[50] : 'transparent',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="icon-container"
          style={{
            color: tokens.colors.secondary[500],
            marginTop: tokens.spacing[1],
          }}
        >
          {getIcon(result.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4
              className="title"
              style={{
                fontSize: tokens.typography.fontSize.sm[0],
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.secondary[900],
                margin: 0,
              }}
            >
              {result.title}
            </h4>
            <span
              className="relevance"
              style={{
                fontSize: tokens.typography.fontSize.xs[0],
                color: tokens.colors.secondary[500],
                fontWeight: tokens.typography.fontWeight.medium,
              }}
            >
              {result.relevance}% match
            </span>
          </div>
          
          <p
            className="subtitle"
            style={{
              fontSize: tokens.typography.fontSize.xs[0],
              color: tokens.colors.secondary[600],
              margin: `${tokens.spacing[1]} 0`,
            }}
          >
            {result.subtitle}
          </p>
          
          <p
            className="description"
            style={{
              fontSize: tokens.typography.fontSize.xs[0],
              color: tokens.colors.secondary[500],
              margin: 0,
              lineHeight: tokens.typography.fontSize.sm[1],
            }}
          >
            {result.description}
          </p>
          
          {result.metadata && (
            <div className="metadata" style={{ marginTop: tokens.spacing[2] }}>
              <div className="flex items-center gap-3 flex-wrap">
                {Object.entries(result.metadata).map(([key, value]) => (
                  <span
                    key={key}
                    className="metadata-item"
                    style={{
                      fontSize: tokens.typography.fontSize.xs[0],
                      color: tokens.colors.secondary[500],
                      display: 'flex',
                      alignItems: 'center',
                      gap: tokens.spacing[1],
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(value),
                      }}
                    />
                    {typeof value === 'boolean' ? (value ? 'Active' : 'Inactive') : value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Filter dropdown component
const FilterDropdown = ({ selectedFilter, onFilterChange, isOpen, onToggle }) => {
  const filterOptions = [
    { value: SEARCH_FILTERS.ALL, label: 'All Results', icon: Search },
    { value: SEARCH_FILTERS.JOBS, label: 'Jobs', icon: Briefcase },
    { value: SEARCH_FILTERS.APPLICATIONS, label: 'Applications', icon: User },
    { value: SEARCH_FILTERS.INTERVIEWS, label: 'Interviews', icon: Calendar },
    { value: SEARCH_FILTERS.TEAM, label: 'Team Members', icon: Building2 },
    { value: SEARCH_FILTERS.MESSAGES, label: 'Messages', icon: MessageSquare },
  ];
  
  return (
    <div className="filter-dropdown" style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
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
        <span>{filterOptions.find(f => f.value === selectedFilter)?.label}</span>
        <ChevronDown 
          className="w-4 h-4 transition-transform"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: tokens.animations.duration[150] }}
            className="filter-menu"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: tokens.spacing[1],
              backgroundColor: 'white',
              border: `1px solid ${tokens.colors.secondary[200]}`,
              borderRadius: tokens.borderRadius.md,
              boxShadow: tokens.shadows.lg,
              zIndex: tokens.zIndex.dropdown,
              overflow: 'hidden',
            }}
          >
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onFilterChange(option.value);
                  onToggle();
                }}
                className="filter-option"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing[2],
                  padding: tokens.spacing[3],
                  width: '100%',
                  textAlign: 'left',
                  backgroundColor: selectedFilter === option.value ? tokens.colors.primary[50] : 'transparent',
                  color: selectedFilter === option.value ? tokens.colors.primary[700] : tokens.colors.secondary[700],
                  border: 'none',
                  cursor: 'pointer',
                  transition: `all ${tokens.animations.duration[150]}`,
                }}
              >
                <option.icon className="w-4 h-4" />
                <span>{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main UniversalSearch component
export const UniversalSearch = ({ 
  placeholder = 'Search jobs, candidates, applications...', 
  context = 'global',
  onResultSelect,
  className = '',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedFilter, setSelectedFilter] = useState(SEARCH_FILTERS.ALL);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Debounced search
  const debouncedSearch = useCallback(
    useMemo(() => {
      let timeoutId;
      return (searchQuery) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (searchQuery.trim().length > 0) {
            setLoading(true);
            try {
              const searchResults = await searchService.search(searchQuery, {
                type: selectedFilter,
                context,
              });
              setResults(searchResults);
              setSelectedIndex(-1);
            } catch (error) {
              console.error('Search error:', error);
              setResults([]);
            } finally {
              setLoading(false);
            }
          } else {
            setResults([]);
          }
        }, 300);
      };
    }, [selectedFilter, context])
  , [selectedFilter, context]);
  
  // Load search history on mount
  useEffect(() => {
    setSearchHistory(searchService.getSearchHistory());
  }, []);
  
  // Handle search
  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel?.();
  }, [query, debouncedSearch]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || results.length === 0) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleResultSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setShowSuggestions(value.length === 0);
  };
  
  const handleInputFocus = () => {
    setIsOpen(true);
    setShowSuggestions(query.length === 0);
  };
  
  const handleResultSelect = (result) => {
    setQuery(result.title);
    setIsOpen(false);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Save to search history
    searchService.saveSearchHistory(result.title);
    setSearchHistory(searchService.getSearchHistory());
    
    // Call callback
    onResultSelect?.(result);
  };
  
  const handleHistorySelect = (historyItem) => {
    setQuery(historyItem);
    setIsOpen(true);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setShowSuggestions(true);
    inputRef.current?.focus();
  };
  
  const suggestions = searchService.getSearchSuggestions(query);
  
  return (
    <div 
      ref={dropdownRef}
      className={`universal-search ${className}`}
      style={{ position: 'relative', width: '100%', maxWidth: '600px' }}
    >
      {/* Search input */}
      <div className="search-input-container" style={{ position: 'relative' }}>
        <div
          className="search-input-wrapper"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderRadius: tokens.borderRadius.lg,
            border: `1px solid ${tokens.colors.secondary[300]}`,
            backgroundColor: 'white',
            transition: `all ${tokens.animations.duration[150]}`,
            overflow: 'hidden',
          }}
        >
          <Search 
            className="search-icon"
            style={{
              width: '20px',
              height: '20px',
              color: tokens.colors.secondary[400],
              marginLeft: tokens.spacing[3],
            }}
          />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="search-input"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: tokens.spacing[3],
              fontSize: tokens.typography.fontSize.sm[0],
              color: tokens.colors.secondary[900],
              backgroundColor: 'transparent',
            }}
          />
          
          {query && (
            <button
              onClick={handleClear}
              className="clear-button"
              style={{
                border: 'none',
                background: 'none',
                padding: tokens.spacing[2],
                marginRight: tokens.spacing[2],
                cursor: 'pointer',
                borderRadius: tokens.borderRadius.sm,
                color: tokens.colors.secondary[400],
                transition: `all ${tokens.animations.duration[150]}`,
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Filter dropdown */}
        <div style={{ position: 'absolute', right: tokens.spacing[2], top: '50%', transform: 'translateY(-50%)' }}>
          <FilterDropdown
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />
        </div>
      </div>
      
      {/* Search results dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: tokens.animations.duration[150] }}
            className="search-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: tokens.spacing[2],
              backgroundColor: 'white',
              border: `1px solid ${tokens.colors.secondary[200]}`,
              borderRadius: tokens.borderRadius.lg,
              boxShadow: tokens.shadows.xl,
              zIndex: tokens.zIndex.dropdown,
              maxHeight: '400px',
              overflow: 'hidden',
            }}
          >
            {/* Loading state */}
            {loading && (
              <div
                className="loading-state"
                style={{
                  padding: tokens.spacing[4],
                  textAlign: 'center',
                  color: tokens.colors.secondary[500],
                }}
              >
                <div className="loading-spinner" />
                <p style={{ margin: `${tokens.spacing[2]} 0 0 0`, fontSize: tokens.typography.fontSize.sm[0] }}>
                  Searching...
                </p>
              </div>
            )}
            
            {/* Search suggestions */}
            {!loading && showSuggestions && query.length === 0 && (
              <div className="search-suggestions">
                {/* Search history */}
                {searchHistory.length > 0 && (
                  <div style={{ padding: tokens.spacing[3] }}>
                    <div
                      className="section-title"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: tokens.spacing[2],
                        marginBottom: tokens.spacing[3],
                        fontSize: tokens.typography.fontSize.xs[0],
                        fontWeight: tokens.typography.fontWeight.semibold,
                        color: tokens.colors.secondary[600],
                        textTransform: 'uppercase',
                      }}
                    >
                      <Clock className="w-3 h-3" />
                      Recent Searches
                    </div>
                    <div className="history-list">
                      {searchHistory.slice(0, 5).map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleHistorySelect(item)}
                          className="history-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: tokens.spacing[2],
                            padding: tokens.spacing[2],
                            width: '100%',
                            textAlign: 'left',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: tokens.colors.secondary[700],
                            cursor: 'pointer',
                            borderRadius: tokens.borderRadius.sm,
                            transition: `all ${tokens.animations.duration[150]}`,
                          }}
                        >
                          <Clock className="w-3 h-3" />
                          <span style={{ fontSize: tokens.typography.fontSize.sm[0] }}>{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Popular suggestions */}
                {suggestions.length > 0 && (
                  <div style={{ padding: tokens.spacing[3], borderTop: `1px solid ${tokens.colors.secondary[100]}` }}>
                    <div
                      className="section-title"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: tokens.spacing[2],
                        marginBottom: tokens.spacing[3],
                        fontSize: tokens.typography.fontSize.xs[0],
                        fontWeight: tokens.typography.fontWeight.semibold,
                        color: tokens.colors.secondary[600],
                        textTransform: 'uppercase',
                      }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      Popular Searches
                    </div>
                    <div className="suggestions-list">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleHistorySelect(suggestion)}
                          className="suggestion-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: tokens.spacing[2],
                            padding: tokens.spacing[2],
                            width: '100%',
                            textAlign: 'left',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: tokens.colors.secondary[700],
                            cursor: 'pointer',
                            borderRadius: tokens.borderRadius.sm,
                            transition: `all ${tokens.animations.duration[150]}`,
                          }}
                        >
                          <TrendingUp className="w-3 h-3" />
                          <span style={{ fontSize: tokens.typography.fontSize.sm[0] }}>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Search results */}
            {!loading && results.length > 0 && (
              <div className="search-results" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <div
                  className="results-header"
                  style={{
                    padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
                    borderBottom: `1px solid ${tokens.colors.secondary[100]}`,
                    fontSize: tokens.typography.fontSize.xs[0],
                    color: tokens.colors.secondary[600],
                    fontWeight: tokens.typography.fontWeight.medium,
                  }}
                >
                  {results.length} results found
                </div>
                {results.map((result, index) => (
                  <SearchResult
                    key={result.id}
                    result={result}
                    onSelect={handleResultSelect}
                    isSelected={index === selectedIndex}
                  />
                ))}
              </div>
            )}
            
            {/* No results */}
            {!loading && query.length > 0 && results.length === 0 && (
              <div
                className="no-results"
                style={{
                  padding: tokens.spacing[6],
                  textAlign: 'center',
                  color: tokens.colors.secondary[500],
                }}
              >
                <Search className="w-8 h-8" style={{ margin: '0 auto', marginBottom: tokens.spacing[3] }} />
                <p style={{ fontSize: tokens.typography.fontSize.sm[0], margin: 0 }}>
                  No results found for "{query}"
                </p>
                <p style={{ fontSize: tokens.typography.fontSize.xs[0], marginTop: tokens.spacing[1] }}>
                  Try different keywords or filters
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UniversalSearch;
