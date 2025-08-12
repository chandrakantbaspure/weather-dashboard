import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, RefreshCw, Droplets, Wind, Eye, Thermometer, Gauge } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { format } from '../utils/dateUtils';

const WeatherCard = ({ weather }) => {
  const { 
    getWeatherIcon, 
    formatTemperature, 
    formatWindSpeed,
    getWindDirection,
    lastUpdated 
  } = useWeather();

  if (!weather) return null;

  const { location, current } = weather;
  
  // Enhanced weather background with dynamic gradients and effects
  const getEnhancedWeatherBackground = (description) => {
    const desc = description.toLowerCase();
    
    if (desc.includes('clear') || desc.includes('sun')) {
      return {
        gradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-yellow-400',
        particles: 'sun',
        cloudOpacity: 0.1
      };
    } else if (desc.includes('cloud') && desc.includes('overcast')) {
      return {
        gradient: 'bg-gradient-to-br from-gray-500 via-blue-600 to-gray-700',
        particles: 'clouds',
        cloudOpacity: 0.8
      };
    } else if (desc.includes('cloud')) {
      return {
        gradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
        particles: 'clouds',
        cloudOpacity: 0.6
      };
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
      return {
        gradient: 'bg-gradient-to-br from-blue-600 via-blue-700 to-gray-800',
        particles: 'rain',
        cloudOpacity: 0.9
      };
    } else if (desc.includes('snow')) {
      return {
        gradient: 'bg-gradient-to-br from-blue-200 via-blue-300 to-white',
        particles: 'snow',
        cloudOpacity: 0.7
      };
    } else if (desc.includes('thunder') || desc.includes('storm')) {
      return {
        gradient: 'bg-gradient-to-br from-purple-700 via-gray-800 to-black',
        particles: 'lightning',
        cloudOpacity: 1.0
      };
    } else if (desc.includes('fog') || desc.includes('mist')) {
      return {
        gradient: 'bg-gradient-to-br from-gray-400 via-gray-500 to-blue-500',
        particles: 'fog',
        cloudOpacity: 0.9
      };
    }
    
    return {
      gradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
      particles: 'clouds',
      cloudOpacity: 0.5
    };
  };

  const weatherConfig = getEnhancedWeatherBackground(current.description);

  // Weather-specific particle components
  const WeatherParticles = ({ type }) => {
    switch (type) {
      case 'clouds':
        return (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, 100, 0],
                  y: [0, -20, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 15 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
                className="absolute w-6 h-4 sm:w-8 sm:h-6 md:w-12 md:h-8 lg:w-16 lg:h-10 bg-white/30 rounded-full blur-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </>
        );
      
      case 'rain':
        return (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, 200],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
                className="absolute w-0.5 h-6 sm:w-1 sm:h-8 md:h-12 bg-blue-300/60 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 50}%`,
                }}
              />
            ))}
          </>
        );
      
      case 'snow':
        return (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, 200],
                  x: [0, Math.random() * 40 - 20],
                  rotate: [0, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear"
                }}
                className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-white/80 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 50}%`,
                }}
              />
            ))}
          </>
        );
      
      case 'lightning':
        return (
          <>
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  delay: Math.random() * 5 + 2,
                  ease: "easeInOut"
                }}
                className="absolute w-full h-full bg-yellow-300/40 rounded-lg"
              />
            ))}
          </>
        );
      
      case 'fog':
        return (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, 50, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
                className="absolute w-12 h-8 sm:w-16 sm:h-10 md:w-20 md:h-12 lg:w-32 lg:h-16 bg-white/20 rounded-full blur-md"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className={`weather-card ${weatherConfig.gradient} relative overflow-hidden hover-card text-white shadow-2xl`}
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
          className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-white/30 rounded-full -mr-8 -mt-8 sm:-mr-12 sm:-mt-12 md:-mr-20 md:-mt-20 lg:-mr-24 lg:-mt-24 blur-sm"
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
          className="absolute bottom-0 left-0 w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-white/20 rounded-full -ml-6 -mb-6 sm:-ml-10 sm:-mb-10 md:-ml-16 md:-mb-16 lg:-ml-20 lg:-mb-20 blur-sm"
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
          className="absolute top-1/2 left-1/2 w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-white/25 rounded-full -ml-5 -mt-5 sm:-ml-8 sm:-mt-8 md:-ml-12 md:-mt-12 lg:-ml-16 lg:-mt-16 blur-sm"
        />
      </div>

      {/* Weather-specific particles */}
      <div className="absolute inset-0 overflow-hidden">
        <WeatherParticles type={weatherConfig.particles} />
      </div>

      {/* Floating clouds effect */}
      <div className="absolute inset-0 overflow-hidden" style={{ opacity: weatherConfig.cloudOpacity }}>
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100, 0],
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
            className="absolute w-10 h-5 sm:w-16 sm:h-8 md:w-24 md:h-12 lg:w-32 lg:h-16 bg-white/40 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 sm:p-5 md:p-6 lg:p-8">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 md:mb-6 lg:mb-8 space-y-2 sm:space-y-0">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 flex-1"
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
              className="relative flex-shrink-0"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white drop-shadow-lg" />
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
            <div className="min-w-0 flex-1 overflow-hidden">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white drop-shadow-lg truncate pr-2">
                {location.name}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-white/90 drop-shadow-md truncate pr-2">
                {location.state && `${location.state}, `}{location.country}
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-right flex-shrink-0"
          >
            <div className="flex items-center justify-end space-x-2 text-white/90">
              <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm md:text-base">{format(new Date(), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center justify-end space-x-2 text-white/80 mt-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="flex-shrink-0"
              >
                <RefreshCw className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
              </motion.div>
              <span className="text-xs sm:text-sm">
                {lastUpdated ? format(lastUpdated, 'HH:mm') : 'Just now'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Main Weather Info */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 md:mb-8 lg:mb-10 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-0 lg:space-x-6 md:space-x-8">
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8 min-w-0 flex-1">
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
              className="relative flex-shrink-0"
            >
              <img
                src={getWeatherIcon(current.icon)}
                alt={current.description}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 filter drop-shadow-2xl"
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
            <div className="min-w-0 flex-1 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-2xl mb-1"
              >
                {formatTemperature(current.temp)}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/95 capitalize font-semibold truncate drop-shadow-lg pr-2"
              >
                {current.description}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="text-xs sm:text-sm md:text-base lg:text-lg text-white/85 flex items-center space-x-2"
              >
                <Thermometer className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span className="truncate">Feels like {formatTemperature(current.feels_like)}</span>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Wind Info */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center lg:text-right flex-shrink-0"
          >
            <div className="flex items-center justify-center lg:justify-end space-x-2 sm:space-x-3 mb-2 sm:mb-3 md:mb-4">
              <motion.div
                animate={{ rotate: current.wind_deg }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative flex-shrink-0"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Wind className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white drop-shadow-lg" />
                </div>
                <motion.div
                  animate={{ 
                    scale: [0, 1.2, 0],
                    opacity: [0, 0.4, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-white/30 rounded-full blur-lg"
                />
              </motion.div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg">
                  {formatWindSpeed(current.wind_speed)}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-white/90 drop-shadow-md">
                  {getWindDirection(current.wind_deg)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Additional Details */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 pt-3 sm:pt-4 md:pt-6 lg:pt-8 border-t border-white/20"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center p-2 sm:p-3 md:p-4 lg:p-5 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
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
              className="flex justify-center mb-1 sm:mb-2 md:mb-3"
            >
              <Droplets className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 text-blue-200 drop-shadow-lg" />
            </motion.div>
            <div className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">
              {current.humidity}%
            </div>
            <div className="text-white/80 text-xs sm:text-sm md:text-base">Humidity</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center p-2 sm:p-3 md:p-4 lg:p-5 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
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
              className="flex justify-center mb-1 sm:mb-2 md:mb-3"
            >
              <Gauge className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 text-green-200 drop-shadow-lg" />
            </motion.div>
            <div className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">
              {current.pressure} hPa
            </div>
            <div className="text-white/80 text-xs sm:text-sm md:text-base">Pressure</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="text-center p-2 sm:p-3 md:p-4 lg:p-5 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
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
              className="flex justify-center mb-1 sm:mb-2 md:mb-3"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-7 lg:h-7 text-purple-200 drop-shadow-lg" />
            </motion.div>
            <div className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">
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
