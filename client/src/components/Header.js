import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  MapPin, 
  Search, 
  Navigation, 
  BarChart3, 
  Home,
  Menu,
  X
} from 'lucide-react';
import { useLocation as useLocationContext } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIndianCitiesOnly, setIsIndianCitiesOnly] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const { 
    currentLocation, 
    searchResults, 
    searchLocations, 
    searchIndianCities,
    setLocation,
    getCurrentLocation 
  } = useLocationContext();
  const { fetchWeatherData } = useWeather();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Forecast', href: '/forecast', icon: Cloud },
    { name: 'Map', href: '/map', icon: MapPin },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  // Handle search input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        if (isIndianCitiesOnly) {
          searchIndianCities(searchQuery);
        } else {
          searchLocations(searchQuery);
        }
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchLocations, searchIndianCities, isIndianCitiesOnly]);

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle location selection
  const handleLocationSelect = async (location) => {
    setLocation(location);
    setIsSearchOpen(false);
    setSearchQuery('');
    await fetchWeatherData(location.name);
  };

  // Handle current location
  const handleCurrentLocation = async () => {
    await getCurrentLocation();
    if (currentLocation) {
      await fetchWeatherData(currentLocation.name);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-header"
    >
      <div className="responsive-container">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-2 sm:p-3 bg-blue-600 rounded-xl shadow-md hover:shadow-lg"
            >
              <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block"
            >
              Weather Dashboard
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base font-bold text-gray-900 sm:hidden"
            >
              Weather
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Link
                    to={item.href}
                    className={`nav-link flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>
                    <span className="font-medium hidden xl:inline">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Search and Location */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Location Search */}
            <div className="relative" ref={searchRef}>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium text-sm">Search</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCurrentLocation}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200"
                  title="Use current location"
                >
                  <Navigation className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Search Dropdown */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 z-50"
                  >
                    <div className="px-4 py-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsIndianCitiesOnly(!isIndianCitiesOnly)}
                          className={`px-2 sm:px-3 py-1 text-xs rounded-full transition-all duration-300 ${
                            isIndianCitiesOnly 
                              ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                              : 'bg-gray-100 text-gray-600 border border-gray-300'
                          }`}
                        >
                          {isIndianCitiesOnly ? '🇮🇳 Indian Cities Only' : '🌍 All Cities'}
                        </motion.button>
                      </div>
                      <input
                        type="text"
                        placeholder={isIndianCitiesOnly ? "Search Indian cities..." : "Search for a city..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input w-full"
                        autoFocus
                      />
                    </div>
                    
                    {searchResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-h-60 overflow-y-auto"
                      >
                        {searchResults.map((result, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                            onClick={() => handleLocationSelect(result)}
                            className="w-full px-4 py-3 text-left transition-all duration-200 hover:bg-blue-50"
                          >
                            <div className="flex items-center space-x-3">
                              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-900 truncate">{result.name}</div>
                                <div className="text-sm text-gray-500 truncate">
                                  {result.state && `${result.state}, `}{result.country}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Current Location Display */}
            {currentLocation && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-2 sm:px-3 py-2 rounded-xl border border-gray-200"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium truncate max-w-24 lg:max-w-32">{currentLocation.name}</span>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 py-4"
            >
              <nav className="flex flex-col space-y-2">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`nav-link flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive(item.href)
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              
              {currentLocation && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium truncate">{currentLocation.name}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
