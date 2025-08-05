
import React from 'react';

const iconPaths = {
  // Basic icons
  Star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  StarHalf: "M12 2L9 8l-7 1 5.5 5L6 22l6-3.5V2z",
  Heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  Share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",
  Check: "m9 12 2 2 4-4",
  CheckCircle: "M22 11.08V12a10 10 0 1 1-5.93-9.14",
  CheckCircle2: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  
  // Navigation icons
  ChevronLeft: "m15 18-6-6 6-6",
  ChevronRight: "m9 18 6-6-6-6",
  ArrowLeft: "M12 19l-7-7 7-7m7 7H5",
  ArrowRight: "m12 5 7 7-7 7M5 12h14",
  Navigation: "m3 11 18-9v18",
  
  // Communication icons
  Phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  MessageCircle: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  
  // Time and calendar
  Clock: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5 11h-6V7h2v4h4v2z",
  Calendar: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  
  // Location and map
  MapPin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
  Map: "m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6",
  
  // Transportation
  Car: "M7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5 9l2-4h10l2 4-2 2H7l-2-2z",
  Building: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",
  
  // User and profile
  User: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
  Users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
  
  // Utilities
  Filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  Search: "m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  Settings: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
  
  // Status indicators
  Wifi: "m1 9 2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8 3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4 2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z",
  WifiOff: "m1 1 22 22m-6.28-11.94A10.94 10.94 0 0 1 23 12l-2-2a13.93 13.93 0 0 0-3.72-2.06m-4.92-2.26A13.93 13.93 0 0 0 1 10l2 2a10.94 10.94 0 0 1 5.06-2.72M9 16l3 3 3-3a4.237 4.237 0 0 0-6 0",
  
  // Actions
  Plus: "M12 5v14m-7-7h14",
  Minus: "M5 12h14",
  X: "M18 6 6 18M6 6l12 12",
  Edit: "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  Trash: "M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
};

export const Icon = ({ 
  name, 
  size = 24, 
  color = "currentColor", 
  className = "",
  ...props 
}) => {
  const path = iconPaths[name];
  
  if (!path) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d={path} />
    </svg>
  );
};

export default Icon;
