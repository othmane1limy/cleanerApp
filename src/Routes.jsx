import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ServiceDiscoveryListView from './pages/service-discovery-list-view';
import LocationPermissionHandler from './pages/location-permission-handler';
import ServiceDiscoveryMapView from './pages/service-discovery-map-view';
import CleanerProfileDetail from './pages/cleaner-profile-detail';
import SearchAndFilterInterface from './pages/search-and-filter-interface';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CleanerProfileDetail />} />
        <Route path="/service-discovery-list-view" element={<ServiceDiscoveryListView />} />
        <Route path="/location-permission-handler" element={<LocationPermissionHandler />} />
        <Route path="/service-discovery-map-view" element={<ServiceDiscoveryMapView />} />
        <Route path="/cleaner-profile-detail" element={<CleanerProfileDetail />} />
        <Route path="/search-and-filter-interface" element={<SearchAndFilterInterface />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
