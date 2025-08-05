import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PullToRefresh = ({ onRefresh, children, language = 'fr' }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  const PULL_THRESHOLD = 80;
  const MAX_PULL_DISTANCE = 120;

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      if (container?.scrollTop === 0) {
        startY.current = e?.touches?.[0]?.clientY;
        isDragging.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging?.current) return;

      currentY.current = e?.touches?.[0]?.clientY;
      const distance = Math.max(0, currentY?.current - startY?.current);
      
      if (distance > 0 && container?.scrollTop === 0) {
        e?.preventDefault();
        const adjustedDistance = Math.min(distance * 0.5, MAX_PULL_DISTANCE);
        setPullDistance(adjustedDistance);
        setCanRefresh(adjustedDistance >= PULL_THRESHOLD);
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging?.current) return;

      isDragging.current = false;

      if (canRefresh && !isRefreshing) {
        setIsRefreshing(true);
        onRefresh()?.finally(() => {
          setIsRefreshing(false);
          setPullDistance(0);
          setCanRefresh(false);
        });
      } else {
        setPullDistance(0);
        setCanRefresh(false);
      }
    };

    container?.addEventListener('touchstart', handleTouchStart, { passive: false });
    container?.addEventListener('touchmove', handleTouchMove, { passive: false });
    container?.addEventListener('touchend', handleTouchEnd);

    return () => {
      container?.removeEventListener('touchstart', handleTouchStart);
      container?.removeEventListener('touchmove', handleTouchMove);
      container?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canRefresh, isRefreshing, onRefresh]);

  const getRefreshText = () => {
    if (isRefreshing) {
      return language === 'ar' ? 'جاري التحديث...' : 'Actualisation...';
    }
    if (canRefresh) {
      return language === 'ar' ? 'اتركه للتحديث' : 'Relâchez pour actualiser';
    }
    return language === 'ar' ? 'اسحب للتحديث' : 'Tirez pour actualiser';
  };

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      {/* Pull to Refresh Indicator */}
      <div 
        className="flex flex-col items-center justify-center transition-all duration-200 ease-out"
        style={{ 
          height: pullDistance,
          opacity: pullDistance > 0 ? 1 : 0,
          transform: `translateY(${pullDistance > 0 ? 0 : -20}px)`
        }}
      >
        <div className={`transition-transform duration-200 ${
          isRefreshing ? 'animate-spin' : canRefresh ? 'rotate-180' : 'rotate-0'
        }`}>
          <Icon 
            name={isRefreshing ? "Loader2" : "ArrowDown"} 
            size={24} 
            className={`${canRefresh ? 'text-primary' : 'text-muted-foreground'}`} 
          />
        </div>
        <span className={`text-sm font-medium mt-2 ${
          canRefresh ? 'text-primary' : 'text-muted-foreground'
        }`}>
          {getRefreshText()}
        </span>
      </div>

      {/* Content */}
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;