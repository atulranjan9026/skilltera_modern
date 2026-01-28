import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * FilterDropdown - A reusable dropdown for filter selection
 */
export default function FilterDropdown({
    label,
    options,
    value,
    onChange,
    isMulti = false,
    placeholder = "Select..."
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        if (isMulti) {
            const newValue = value.includes(option)
                ? value.filter(v => v !== option)
                : [...value, option];
            onChange(newValue);
        } else {
            onChange(option);
            setIsOpen(false);
        }
    };

    const isActive = isMulti ? value.length > 0 : !!value;

    const getDisplayValue = () => {
        if (isMulti) {
            if (!value || value.length === 0) return label;
            return `${label}: ${value.length}`;
        }
        return value ? `${label}: ${value}` : label;
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
                    } ${isOpen ? 'ring-2 ring-primary-500/10 border-primary-500' : ''}`}
            >
                <span>{getDisplayValue()}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 min-w-[200px] bg-white border border-slate-200 rounded-xl shadow-xl max-h-80 overflow-y-auto animate-in fade-in zoom-in duration-200">
                    <div className="p-2">
                        <h4 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</h4>
                        <div className="space-y-1">
                            {options.map((option) => {
                                const isSelected = isMulti ? value.includes(option) : value === option;
                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleSelect(option)}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${isSelected
                                                ? 'bg-primary-50 text-primary-700 font-medium'
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span>{option}</span>
                                        {isSelected && <Check size={14} />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
