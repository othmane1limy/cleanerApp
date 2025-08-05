import React, { useState, useRef, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ 
  value = '', 
  onChange = () => {}, 
  onSearch = () => {},
  language = 'fr',
  suggestions = [],
  onSuggestionSelect = () => {},
  className = ''
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const mockSuggestions = [
    { id: 1, text: language === 'ar' ? 'غسيل خارجي' : 'Lavage extérieur', type: 'service' },
    { id: 2, text: language === 'ar' ? 'تنظيف داخلي' : 'Nettoyage intérieur', type: 'service' },
    { id: 3, text: language === 'ar' ? 'خدمة شاملة' : 'Service complet', type: 'service' },
    { id: 4, text: language === 'ar' ? 'أحمد المنظف' : 'Ahmed Nettoyeur', type: 'cleaner' },
    { id: 5, text: language === 'ar' ? 'خدمة متنقلة' : 'Service mobile', type: 'service' },
    { id: 6, text: language === 'ar' ? 'تفصيل متقدم' : 'Détailing avancé', type: 'service' }
  ];

  const filteredSuggestions = value?.length > 0 
    ? mockSuggestions?.filter(suggestion => 
        suggestion?.text?.toLowerCase()?.includes(value?.toLowerCase())
      )?.slice(0, 5)
    : [];

  const handleInputChange = (e) => {
    const newValue = e?.target?.value;
    onChange(newValue);
    setShowSuggestions(newValue?.length > 0);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'ArrowDown') {
      e?.preventDefault();
      setActiveSuggestion(prev => 
        prev < filteredSuggestions?.length - 1 ? prev + 1 : prev
      );
    } else if (e?.key === 'ArrowUp') {
      e?.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e?.key === 'Enter') {
      e?.preventDefault();
      if (activeSuggestion >= 0) {
        handleSuggestionClick(filteredSuggestions?.[activeSuggestion]);
      } else {
        handleSearch();
      }
    } else if (e?.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion?.text);
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleSearch = () => {
    onSearch(value);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onChange('');
    setShowSuggestions(false);
    inputRef?.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef?.current && !suggestionsRef?.current?.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder={language === 'ar' ? 'ابحث عن منظفين أو خدمات...' : 'Rechercher des nettoyeurs ou services...'}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pr-20 rtl:pr-4 rtl:pl-20"
        />
        
        <div className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 rtl:space-x-reverse">
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              iconName="X"
              iconSize={16}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            iconName="Search"
            iconSize={16}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
          />
        </div>
      </div>
      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions?.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-lg shadow-modal max-h-60 overflow-y-auto"
        >
          {filteredSuggestions?.map((suggestion, index) => (
            <button
              key={suggestion?.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center space-x-3 rtl:space-x-reverse ${
                index === activeSuggestion ? 'bg-muted' : ''
              }`}
            >
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon 
                  name={suggestion?.type === 'cleaner' ? 'User' : 'Wrench'} 
                  size={14} 
                  className="text-primary" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-foreground truncate">
                  {suggestion?.text}
                </p>
                <p className="font-caption text-xs text-muted-foreground">
                  {suggestion?.type === 'cleaner' 
                    ? (language === 'ar' ? 'منظف' : 'Nettoyeur')
                    : (language === 'ar' ? 'خدمة' : 'Service')
                  }
                </p>
              </div>
              <Icon name="ArrowUpRight" size={14} className="text-muted-foreground rtl:rotate-180" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;