import React from 'react';

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count })?.map((_, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
          {/* Header Section */}
          <div className="flex items-start space-x-3 rtl:space-x-reverse mb-3">
            {/* Profile Image Skeleton */}
            <div className="w-16 h-16 bg-muted rounded-full flex-shrink-0" />
            
            {/* Info Section */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  {/* Name */}
                  <div className="h-4 bg-muted rounded w-32" />
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      {Array.from({ length: 5 })?.map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-muted rounded" />
                      ))}
                    </div>
                    <div className="h-3 bg-muted rounded w-12" />
                  </div>
                  
                  {/* Distance */}
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
                
                {/* Status Badge */}
                <div className="h-6 bg-muted rounded-full w-16" />
              </div>
            </div>
          </div>

          {/* Service Badges */}
          <div className="flex space-x-2 rtl:space-x-reverse mb-3">
            <div className="h-6 bg-muted rounded-full w-16" />
            <div className="h-6 bg-muted rounded-full w-20" />
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1 mb-3">
            <div className="h-6 bg-muted rounded w-20" />
            <div className="h-6 bg-muted rounded w-24" />
            <div className="h-6 bg-muted rounded w-16" />
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <div className="h-3 bg-muted rounded w-20" />
              <div className="h-5 bg-muted rounded w-16" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 rtl:space-x-reverse">
            <div className="h-8 bg-muted rounded flex-1" />
            <div className="h-8 bg-muted rounded flex-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;