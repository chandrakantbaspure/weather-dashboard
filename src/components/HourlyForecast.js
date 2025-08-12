import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import { format } from '../utils/dateUtils';

const HourlyForecast = ({ forecast }) => {
  const { getWeatherIcon, formatTemperature, formatWindSpeed } = useWeather();

  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-2 sm:space-x-3 md:space-x-4 pb-3 sm:pb-4">
        {forecast.map((hour, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)"
            }}
            className="flex-shrink-0 w-16 sm:w-20 md:w-24 text-center group"
          >
            <div className="relative bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
              {/* Hover effect background */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent rounded-lg sm:rounded-xl"
              />
              
              <div className="relative z-10">
                {/* Time */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="text-xs sm:text-sm font-bold text-gray-900 mb-1 sm:mb-2 md:mb-3"
                >
                  {format(new Date(hour.time), 'HH:mm')}
                </motion.div>
                
                {/* Weather Icon */}
                <motion.div 
                  className="mb-1 sm:mb-2 md:mb-3"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                >
                  <img
                    src={getWeatherIcon(hour.icon)}
                    alt={hour.description}
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mx-auto filter drop-shadow-lg"
                  />
                </motion.div>
                
                {/* Temperature */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2"
                >
                  {formatTemperature(hour.temp)}
                </motion.div>
                
                {/* Description */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="text-xs text-gray-600 mb-1 sm:mb-2 md:mb-3 capitalize truncate"
                >
                  {hour.description}
                </motion.div>
                
                {/* Wind Speed */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  className="text-xs text-gray-500 font-medium"
                >
                  {formatWindSpeed(hour.wind_speed)}
                </motion.div>
              </div>
              
              {/* Animated border on hover */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-b-lg sm:rounded-b-xl"
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-center mt-3 sm:mt-4"
      >
        <motion.div
          animate={{ 
            x: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-gray-500 text-xs sm:text-sm"
        >
          ← Scroll for more hours →
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HourlyForecast;
