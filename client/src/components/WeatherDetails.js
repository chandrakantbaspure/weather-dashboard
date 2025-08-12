import React from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Wind, 
  Eye, 
  Thermometer, 
  Gauge, 
  Sun,
  Compass,
  Clock
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { format } from 'date-fns';

const WeatherDetails = ({ weather }) => {
  const { 
    formatTemperature, 
    formatWindSpeed, 
    formatHumidity, 
    formatPressure, 
    formatVisibility,
    getWindDirection 
  } = useWeather();

  if (!weather) return null;

  const { current } = weather;

  const details = [
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: formatTemperature(current.feels_like),
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      animation: { rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: formatHumidity(current.humidity),
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      animation: { y: [0, -5, 0], scale: [1, 1.1, 1] }
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: formatWindSpeed(current.wind_speed),
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      animation: { rotate: [0, 360], scale: [1, 1.1, 1] }
    },
    {
      icon: Compass,
      label: 'Wind Direction',
      value: getWindDirection(current.wind_deg),
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200',
      animation: { rotate: current.wind_deg, scale: [1, 1.1, 1] }
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: formatPressure(current.pressure),
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200',
      animation: { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: formatVisibility(current.visibility),
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
      borderColor: 'border-indigo-200',
      animation: { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-3 sm:space-y-4 md:space-y-6"
    >
      {/* Weather Details Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="weather-card relative overflow-hidden"
      >
        {/* Animated background */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-100/50 rounded-full blur-xl"
        />
        
        <div className="relative z-10">
          <motion.h3 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6"
          >
            Weather Details
          </motion.h3>
          
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {details.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1 + 0.4,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    x: 5
                  }}
                  className="flex items-center justify-between p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                    <motion.div 
                      animate={detail.animation}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl ${detail.bgColor} border ${detail.borderColor}`}
                    >
                      <Icon className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${detail.color}`} />
                    </motion.div>
                    <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">
                      {detail.label}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                    {detail.value}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* UV Index Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="weather-card relative overflow-hidden"
      >
        {/* Animated sun background */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-yellow-100/50 rounded-full blur-xl"
        />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-3 sm:mb-4 md:mb-6"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="p-1.5 sm:p-2 md:p-3 bg-yellow-100 rounded-lg sm:rounded-xl border border-yellow-200"
            >
              <Sun className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-600" />
            </motion.div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">UV Index</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">Sun protection needed</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-2 sm:space-y-3 md:space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm md:text-base text-gray-600">Current</span>
              <motion.span 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9 }}
                className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900"
              >
                {current.uv_index || 'N/A'}
              </motion.span>
            </div>
            
            {/* UV Index Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 md:h-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((current.uv_index || 0) * 10, 100)}%` }}
                transition={{ duration: 1, delay: 1 }}
                className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 h-1.5 sm:h-2 md:h-3 rounded-full"
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
              <span>Very High</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Weather Description */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        className="weather-card relative overflow-hidden"
      >
        {/* Animated background */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-100/50 rounded-full blur-xl"
        />
        
        <div className="relative z-10">
          <motion.h3 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4"
          >
            Current Conditions
          </motion.h3>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="flex items-center space-x-2 sm:space-x-3 md:space-x-4"
          >
            <motion.img
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
              alt={current.description}
              className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 filter drop-shadow-lg"
            />
            <div className="min-w-0 flex-1">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-sm sm:text-base md:text-lg font-bold text-gray-900 capitalize truncate"
              >
                {current.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600"
              >
                <Clock className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                <span className="text-xs sm:text-sm">
                  {format(new Date(), 'EEEE, MMMM do')}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WeatherDetails;
