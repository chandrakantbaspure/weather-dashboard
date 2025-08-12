import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Forecast from './pages/Forecast';
import Map from './pages/Map';
import Analytics from './pages/Analytics';
import SEO from './components/SEO';
import { WeatherProvider } from './context/WeatherContext';
import { LocationProvider } from './context/LocationContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <HelmetProvider>
        <SEO 
          title="Loading Weather Dashboard - Real-Time Weather Forecast"
          description="Loading your personalized weather dashboard with real-time forecasts, interactive maps, and weather analytics."
        />
        <div className="app-container bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="loading-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="loading-spinner mx-auto mb-4"></div>
              <h2 className="text-white text-xl font-semibold">Loading Weather Dashboard...</h2>
            </motion.div>
          </div>
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <SEO />
      <LocationProvider>
        <WeatherProvider>
          <div className="app-container bg-gray-50">
            <Header />
            <main className="main-content">
              <div className="container mx-auto px-4 py-6">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="page-container"
                        >
                          <Dashboard />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/forecast" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="page-container"
                        >
                          <Forecast />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/map" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="page-container"
                        >
                          <Map />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/analytics" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="page-container"
                        >
                          <Analytics />
                        </motion.div>
                      } 
                    />
                  </Routes>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </WeatherProvider>
      </LocationProvider>
    </HelmetProvider>
  );
}

export default App;
