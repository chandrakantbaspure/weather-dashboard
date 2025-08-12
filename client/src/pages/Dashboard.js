import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Wind, 
  Eye, 
  Thermometer, 
  Clock,
  MapPin,
  Cloud,
  Sun,
  CloudRain,
  Snowflake
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import WeatherCard from '../components/WeatherCard';
import HourlyForecast from '../components/HourlyForecast';
import WeatherDetails from '../components/WeatherDetails';
import PopularCities from '../components/PopularCities';

// Weather condition animations
const WeatherAnimation = ({ condition }) => {
  const getWeatherIcon = () => {
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />;
      case 'snow':
        return <Snowflake className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />;
      default:
        return <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />;
    }
  };

  return (
    <motion.div
      animate={{ 
        y: [0, -8, 0],
        rotate: [0, 3, -3, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute top-2 right-2 sm:top-4 sm:right-4"
    >
      {getWeatherIcon()}
    </motion.div>
  );
};

const Dashboard = () => {
  const { currentLocation, popularCities } = useLocation();
  const { 
    currentWeather, 
    hourlyForecast, 
    loading, 
    error,
    fetchWeatherData 
  } = useWeather();

  useEffect(() => {
    if (currentLocation && !currentWeather) {
      fetchWeatherData(currentLocation.name);
    }
  }, [currentLocation, currentWeather, fetchWeatherData]);

  if (loading && !currentWeather) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[60vh] px-4"
      >
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            className="loading-spinner mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-base sm:text-lg"
          >
            Loading weather data...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (error && !currentWeather) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center min-h-[60vh] px-4"
      >
        <div className="text-center max-w-md mx-auto">
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 3, -3, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-red-500 mb-6"
          >
            <Cloud className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
          </motion.div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Error Loading Weather</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => currentLocation && fetchWeatherData(currentLocation.name)}
            className="btn-primary"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!currentLocation && !currentWeather) {
    return (
      <div className="responsive-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center py-8 sm:py-12"
        >
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-8"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
              <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Welcome to Weather Dashboard
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Get real-time weather information for any location around the world with beautiful animations and detailed insights
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <PopularCities />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="responsive-container touch-spacing">
      {/* Current Weather Section */}
      {currentWeather && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Weather Card */}
            <div className="lg:col-span-2">
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <WeatherCard weather={currentWeather} />
              </motion.div>
            </div>

            {/* Weather Details */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <WeatherDetails weather={currentWeather} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hourly Forecast */}
      {hourlyForecast && hourlyForecast.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.3 }}
            className="weather-card relative overflow-hidden"
          >
            <WeatherAnimation condition={currentWeather?.current?.weather?.[0]?.main} />
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Hourly Forecast</h2>
            </div>
            <HourlyForecast forecast={hourlyForecast} />
          </motion.div>
        </motion.div>
      )}

      {/* Quick Stats */}
      {currentWeather && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="responsive-grid-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.03, y: -3 }}
            transition={{ duration: 0.3 }}
            className="weather-card text-center hover-card relative overflow-hidden"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex items-center justify-center mb-3 sm:mb-4"
            >
              <Thermometer className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </motion.div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              {Math.round(currentWeather.current.temp)}°C
            </div>
            <div className="text-gray-600 text-sm sm:text-base">Temperature</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -3 }}
            transition={{ duration: 0.3 }}
            className="weather-card text-center hover-card relative overflow-hidden"
          >
            <motion.div
              animate={{ 
                y: [0, -3, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex items-center justify-center mb-3 sm:mb-4"
            >
              <Droplets className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </motion.div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              {currentWeather.current.humidity}%
            </div>
            <div className="text-gray-600 text-sm sm:text-base">Humidity</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -3 }}
            transition={{ duration: 0.3 }}
            className="weather-card text-center hover-card relative overflow-hidden"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="flex items-center justify-center mb-3 sm:mb-4"
            >
              <Wind className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            </motion.div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              {Math.round(currentWeather.current.wind_speed * 10) / 10} m/s
            </div>
            <div className="text-gray-600 text-sm sm:text-base">Wind Speed</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -3 }}
            transition={{ duration: 0.3 }}
            className="weather-card text-center hover-card relative overflow-hidden"
          >
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
              className="flex items-center justify-center mb-3 sm:mb-4"
            >
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            </motion.div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              {currentWeather.current.visibility} km
            </div>
            <div className="text-gray-600 text-sm sm:text-base">Visibility</div>
          </motion.div>
        </motion.div>
      )}

      {/* Popular Cities */}
      {popularCities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <PopularCities />
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
