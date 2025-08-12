import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Star } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';

const PopularCities = () => {
  const { popularCities, setLocation } = useLocation();
  const { fetchWeatherData } = useWeather();

  const handleCityClick = async (city) => {
    setLocation(city);
    await fetchWeatherData(city.name);
  };

  if (!popularCities || popularCities.length === 0) return null;

  // Separate Indian cities from international cities
  const indianCities = popularCities.filter(city => city.country === 'IN');
  const internationalCities = popularCities.filter(city => city.country !== 'IN');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-4 sm:space-y-6 md:space-y-8"
    >
      {/* Indian Cities Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="weather-card relative overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-orange-100/50 rounded-full blur-xl"
        />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 md:mb-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-xl sm:text-2xl md:text-3xl"
            >
              🇮🇳
            </motion.div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Major Indian Cities</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">Explore weather in popular Indian destinations</p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {indianCities.map((city, index) => (
              <motion.button
                key={city.name}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1 + 0.4,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCityClick(city)}
                className="group relative p-2 sm:p-3 md:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
              >
                {/* Hover effect background */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg sm:rounded-xl"
                />
                
                <div className="relative z-10 flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-500 group-hover:text-orange-600 transition-colors duration-300" />
                  </motion.div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-orange-700 transition-colors duration-300 truncate">
                      {city.name}
                    </div>
                    <div className="text-xs text-gray-600 group-hover:text-orange-600 transition-colors duration-300 truncate">
                      {city.state}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* International Cities Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="weather-card relative overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div
          animate={{ 
            rotate: [0, -360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-100/50 rounded-full blur-xl"
        />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 md:mb-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-xl sm:text-2xl md:text-3xl"
            >
              🌍
            </motion.div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">International Cities</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">Discover weather around the globe</p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {internationalCities.map((city, index) => (
              <motion.button
                key={city.name}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1 + 0.6,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCityClick(city)}
                className="group relative p-2 sm:p-3 md:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
              >
                {/* Hover effect background */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg sm:rounded-xl"
                />
                
                <div className="relative z-10 flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
                  </motion.div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 truncate">
                      {city.name}
                    </div>
                    <div className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors duration-300 truncate">
                      {city.country}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Access Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="weather-card text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex justify-center mb-2 sm:mb-3 md:mb-4"
        >
          <Star className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-500" />
        </motion.div>
        <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Quick Weather Access</h4>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3 md:mb-4">Click on any city above to instantly view its current weather conditions</p>
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-blue-50 rounded-lg border border-blue-200"
        >
          <span className="text-blue-700 text-xs sm:text-sm">Real-time updates available</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PopularCities;
