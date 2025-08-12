import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Forecast from './pages/Forecast';
import Map from './pages/Map';
import Analytics from './pages/Analytics';
import AnimatedBackground from './components/AnimatedBackground';
import { WeatherProvider } from './context/WeatherContext';
import { LocationProvider } from './context/LocationContext';

// Enhanced loading screen
const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden"
  >
    <AnimatedBackground />
    
    {/* Floating weather icons */}
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute top-1/4 left-1/4 text-blue-400/30"
    >
      <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </motion.div>
    
    <motion.div
      animate={{ 
        y: [0, 20, 0],
        rotate: [0, -5, 5, 0]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
      className="absolute top-1/3 right-1/4 text-purple-400/20"
    >
      <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center relative z-10 px-4"
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg"
      >
        <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
      >
        Weather Dashboard
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8"
      >
        Loading your weather experience...
      </motion.p>
      
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="loading-spinner mx-auto"
      />
    </motion.div>
  </motion.div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading with enhanced timing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Increased loading time for better UX

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <LocationProvider>
      <WeatherProvider>
        <div className="min-h-screen relative bg-white">
          <AnimatedBackground />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <Header />
            
            <main className="responsive-container py-4 sm:py-6 relative z-10">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{ 
                          duration: 0.6,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                      >
                        <Dashboard />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/forecast" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, x: 50, rotateY: 15 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: -50, rotateY: -15 }}
                        transition={{ 
                          duration: 0.6,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                      >
                        <Forecast />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/map" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateZ: -5 }}
                        animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                        exit={{ opacity: 0, scale: 0.9, rotateZ: 5 }}
                        transition={{ 
                          duration: 0.6,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                      >
                        <Map />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <motion.div
                        initial={{ opacity: 0, y: 30, rotateX: 15 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: -30, rotateX: -15 }}
                        transition={{ 
                          duration: 0.6,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                      >
                        <Analytics />
                      </motion.div>
                    } 
                  />
                </Routes>
              </AnimatePresence>
            </main>
          </motion.div>
        </div>
      </WeatherProvider>
    </LocationProvider>
  );
}

export default App;
