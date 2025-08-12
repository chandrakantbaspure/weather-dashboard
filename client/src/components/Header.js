import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
            >
              <Cloud className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gray-900">Weather Dashboard</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search and Location */}
          <div className="flex items-center space-x-4">
            {/* Location Search */}
            <div className="relative" ref={searchRef}>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
                
                <button
                  onClick={handleCurrentLocation}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Use current location"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>

              {/* Search Dropdown */}
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setIsIndianCitiesOnly(!isIndianCitiesOnly)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                          isIndianCitiesOnly 
                            ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                        }`}
                      >
                        {isIndianCitiesOnly ? '🇮🇳 Indian Cities Only' : '🌍 All Cities'}
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder={isIndianCitiesOnly ? "Search Indian cities..." : "Search for a city..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="max-h-60 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => handleLocationSelect(result)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{result.name}</div>
                              <div className="text-sm text-gray-500">
                                {result.state && `${result.state}, `}{result.country}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Current Location Display */}
            {currentLocation && (
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{currentLocation.name}</span>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            
            {currentLocation && (
              <div className="mt-4 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{currentLocation.name}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
