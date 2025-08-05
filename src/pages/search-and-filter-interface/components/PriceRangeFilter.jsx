import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PriceRangeFilter = ({ 
  value = [0, 500], 
  onChange = () => {}, 
  language = 'fr' 
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  const minPrice = 0;
  const maxPrice = 500;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSliderChange = (newValue) => {
    setLocalValue(newValue);
    if (!isDragging) {
      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onChange(localValue);
  };

  const priceRanges = [
    { min: 0, max: 50, label: '0-50 MAD', popular: false },
    { min: 50, max: 100, label: '50-100 MAD', popular: true },
    { min: 100, max: 200, label: '100-200 MAD', popular: true },
    { min: 200, max: 350, label: '200-350 MAD', popular: false },
    { min: 350, max: 500, label: '350+ MAD', popular: false }
  ];

  const handlePresetClick = (min, max) => {
    const newValue = [min, max];
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      {/* Current Range Display */}
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Icon name="DollarSign" size={16} className="text-primary" />
          <span className="font-body text-sm text-foreground">
            {language === 'ar' ? 'النطاق المحدد:' : 'Gamme sélectionnée:'}
          </span>
        </div>
        <span className="font-data text-sm font-medium text-primary">
          {localValue?.[0]} - {localValue?.[1]} MAD
        </span>
      </div>
      {/* Custom Range Slider */}
      <div className="px-2">
        <div className="relative h-6 flex items-center">
          <div className="w-full h-2 bg-muted rounded-full relative">
            {/* Track */}
            <div 
              className="absolute h-2 bg-primary rounded-full"
              style={{
                left: `${(localValue?.[0] / maxPrice) * 100}%`,
                width: `${((localValue?.[1] - localValue?.[0]) / maxPrice) * 100}%`
              }}
            />
            
            {/* Min Handle */}
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={localValue?.[0]}
              onChange={(e) => {
                const newMin = Math.min(Number(e?.target?.value), localValue?.[1] - 10);
                handleSliderChange([newMin, localValue?.[1]]);
              }}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={handleMouseUp}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
            
            {/* Max Handle */}
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={localValue?.[1]}
              onChange={(e) => {
                const newMax = Math.max(Number(e?.target?.value), localValue?.[0] + 10);
                handleSliderChange([localValue?.[0], newMax]);
              }}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={handleMouseUp}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
          </div>
        </div>
        
        {/* Range Labels */}
        <div className="flex justify-between mt-2">
          <span className="font-caption text-xs text-muted-foreground">0 MAD</span>
          <span className="font-caption text-xs text-muted-foreground">500+ MAD</span>
        </div>
      </div>
      {/* Preset Ranges */}
      <div>
        <h4 className="font-body text-sm font-medium text-foreground mb-3">
          {language === 'ar' ? 'نطاقات شائعة:' : 'Gammes populaires:'}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {priceRanges?.map((range, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(range?.min, range?.max)}
              className={`p-3 rounded-lg border text-left transition-all ${
                localValue?.[0] === range?.min && localValue?.[1] === range?.max
                  ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/50 text-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-data text-sm font-medium">
                  {range?.label}
                </span>
                {range?.popular && (
                  <span className="bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded">
                    {language === 'ar' ? 'شائع' : 'Populaire'}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;