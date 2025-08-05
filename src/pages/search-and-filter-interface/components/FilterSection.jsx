import React, { useState } from 'react';
import Button from '../../../components/ui/Button';


import Icon from '../../../components/AppIcon';

const FilterSection = ({ 
  title, 
  children, 
  isCollapsible = true, 
  defaultExpanded = true,
  activeCount = 0,
  onClear = () => {},
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    if (isCollapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`border-b border-border last:border-b-0 ${className}`}>
      <div 
        className={`flex items-center justify-between p-4 ${isCollapsible ? 'cursor-pointer' : ''}`}
        onClick={toggleExpanded}
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <h3 className="font-heading font-medium text-base text-foreground">
            {title}
          </h3>
          {activeCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-data px-2 py-1 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                onClear();
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Effacer
            </Button>
          )}
          {isCollapsible && (
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterSection;