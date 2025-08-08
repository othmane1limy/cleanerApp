import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from './pages/NotFound';
import ServiceDiscoveryListView from './pages/service-discovery-list-view';
import LocationPermissionHandler from './pages/location-permission-handler';
import ServiceDiscoveryMapView from './pages/service-discovery-map-view';
import CleanerProfileDetail from './pages/cleaner-profile-detail';
import SearchAndFilterInterface from './pages/search-and-filter-interface';
import MobileBookingFlow from './pages/mobile-booking-flow';
import BookingPending from './pages/booking-pending';
import GarageBookingFlow from './pages/garage-booking-flow';
import BookingConfirmation from './pages/booking-confirmation';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CleanerDashboard from './pages/cleaner-dashboard';


const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ServiceDiscoveryListView />} />
        <Route path="/service-discovery-list-view" element={<ServiceDiscoveryListView />} />
        <Route path="/location-permission-handler" element={<LocationPermissionHandler />} />
        <Route path="/service-discovery-map-view" element={<ServiceDiscoveryMapView />} />
        <Route path="/cleaner-profile-detail/:cleanerId" element={<CleanerProfileDetail />} />
        <Route path="/search-and-filter-interface" element={<SearchAndFilterInterface />} />
        <Route path="/mobile-booking" element={<MobileBookingFlow />} />
        <Route path="/booking-pending" element={<BookingPending />} />
        <Route path="/garage-booking" element={<GarageBookingFlow />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cleaner-dashboard" element={<CleanerDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;