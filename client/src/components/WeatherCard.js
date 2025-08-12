import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, RefreshCw, Droplets, Wind, Eye, Thermometer, Gauge } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { format } from 'date-fns';

const WeatherCard = ({ weather }) => {
  const { 
    getWeatherIcon, 
    getWeatherBackground, 
    formatTemperature, 
    formatWindSpeed,
    getWindDirection,
    lastUpdated 
  } = useWeather();

  if (!weather) return null;

  const { location, current } = weather;
  
  // Enhanced weather background with dynamic gradients
  const getEnhancedWeatherBackground = (description) => {
    const desc = description.toLowerCase();
    
    if (desc.includes('clear') || desc.includes('sun')) {
      return 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500';
    } else if (desc.includes('cloud') && desc.includes('overcast')) {
      return 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
    } else if (desc.includes('cloud')) {
      return 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500';
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
      return 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700';
    } else if (desc.includes('snow')) {
      return 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400';
    } else if (desc.includes('thunder') || desc.includes('storm')) {
      return 'bg-gradient-to-br from-purple-600 via-purple-700 to-gray-800';
    } else if (desc.includes('fog') || desc.includes('mist')) {
      return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500';
    }
    
    return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
  };

  const weatherClass = getEnhancedWeatherBackground(current.description);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className={`weather-card ${weatherClass} relative overflow-hidden hover-card text-white shadow-2xl`}
    >
      {/* Enhanced Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-white/30 rounded-full -mr-12 -mt-12 sm:-mr-20 sm:-mt-20 md:-mr-24 md:-mt-24 blur-sm"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white/20 rounded-full -ml-10 -mb-10 sm:-ml-16 sm:-mb-16 md:-ml-20 md:-mb-20 blur-sm"
        />
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white/25 rounded-full -ml-8 -mt-8 sm:-ml-12 sm:-mt-12 md:-ml-16 md:-mt-16 blur-sm"
        />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8 space-y-2 sm:space-y-0">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-2 sm:space-x-3 md:space-x-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <MapPin className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-lg" />
              <motion.div
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-white/30 rounded-full blur-md"
              />
            </motion.div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg truncate">
                {location.name}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-white/90 drop-shadow-md truncate">
                {location.state && `${location.state}, `}{location.country}
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-right"
          >
            <div className="flex items-center justify-end space-x-2 text-white/90">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium text-xs sm:text-sm md:text-base">{format(new Date(), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center justify-end space-x-2 text-white/80 mt-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-2 h-2 sm:w-3 sm:h-3" />
              </motion.div>
              <span className="text-xs sm:text-sm">
                {lastUpdated ? format(lastUpdated, 'HH:mm') : 'Just now'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Main Weather Info */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8 md:mb-10 space-y-4 sm:space-y-6 lg:space-y-0 lg:space-x-6 md:space-x-8">
          <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1],
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <img
                src={getWeatherIcon(current.icon)}
                alt={current.description}
                className="weather-icon-large filter drop-shadow-2xl"
              />
              <motion.div
                animate={{ 
                  scale: [0, 1.2, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-white/40 rounded-full blur-xl"
              />
            </motion.div>
            <div className="min-w-0 flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="temp-display mb-1 sm:mb-2 md:mb-3 text-white drop-shadow-2xl"
              >
                {formatTemperature(current.temp)}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-lg sm:text-xl md:text-2xl text-white/95 capitalize font-semibold truncate drop-shadow-lg"
              >
                {current.description}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="text-sm sm:text-base md:text-lg text-white/85 flex items-center space-x-2"
              >
                <Thermometer className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Feels like {formatTemperature(current.feels_like)}</span>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Wind Info */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center lg:text-right"
          >
            <div className="flex items-center justify-center lg:justify-end space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <motion.div
                animate={{ rotate: current.wind_deg }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Wind className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-lg" />
                </div>
                <motion.div
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-white/30 rounded-full blur-md"
                />
              </motion.div>
              <span className="text-sm sm:text-lg md:text-xl text-white font-semibold drop-shadow-lg">
                {getWindDirection(current.wind_deg)}
              </span>
            </div>
            <div className="text-sm sm:text-base md:text-lg text-white/90 font-medium drop-shadow-md">
              {formatWindSpeed(current.wind_speed)}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Additional Details */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6 md:pt-8 border-t border-white/20"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center p-3 sm:p-4 md:p-5 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
          >
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex justify-center mb-2 sm:mb-3"
            >
              <Droplets className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-200 drop-shadow-lg" />
            </motion.div>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">
              {current.humidity}%
            </div>
            <div className="text-white/80 text-xs sm:text-sm md:text-base">Humidity</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center p-3 sm:p-4 md:p-5 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="flex justify-center mb-2 sm:mb-3"
            >
              <Gauge className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-200 drop-shadow-lg" />
            </motion.div>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">
              {current.pressure} hPa
            </div>
            <div className="text-white/80 text-xs sm:text-sm md:text-base">Pressure</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center p-3 sm:p-4 md:p-5 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex justify-center mb-2 sm:mb-3"
            >
              <Eye className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-200 drop-shadow-lg" />
            </motion.div>
            <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">
              {current.visibility} km
            </div>
            <div className="text-white/80 text-xs sm:text-sm md:text-base">Visibility</div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
