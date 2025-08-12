import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Wind, 
  Eye, 
  Thermometer, 
  Clock,
  MapPin,
  Cloud
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import WeatherCard from '../components/WeatherCard';
import HourlyForecast from '../components/HourlyForecast';
import WeatherDetails from '../components/WeatherDetails';
import PopularCities from '../components/PopularCities';

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error && !currentWeather) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Cloud className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Weather</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => currentLocation && fetchWeatherData(currentLocation.name)}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentLocation && !currentWeather) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Weather Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Get real-time weather information for any location around the world
            </p>
          </div>

          <PopularCities />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Current Weather Section */}
      {currentWeather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Weather Card */}
            <div className="lg:col-span-2">
              <WeatherCard weather={currentWeather} />
            </div>

            {/* Weather Details */}
            <div className="space-y-6">
              <WeatherDetails weather={currentWeather} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Hourly Forecast */}
      {hourlyForecast && hourlyForecast.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="weather-card">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Hourly Forecast</h2>
            </div>
            <HourlyForecast forecast={hourlyForecast} />
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      {currentWeather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="weather-card text-center">
            <div className="flex items-center justify-center mb-2">
              <Thermometer className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(currentWeather.current.temp)}°C
            </div>
            <div className="text-sm text-gray-600">Temperature</div>
          </div>

          <div className="weather-card text-center">
            <div className="flex items-center justify-center mb-2">
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {currentWeather.current.humidity}%
            </div>
            <div className="text-sm text-gray-600">Humidity</div>
          </div>

          <div className="weather-card text-center">
            <div className="flex items-center justify-center mb-2">
              <Wind className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(currentWeather.current.wind_speed * 10) / 10} m/s
            </div>
            <div className="text-sm text-gray-600">Wind Speed</div>
          </div>

          <div className="weather-card text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {currentWeather.current.visibility} km
            </div>
            <div className="text-sm text-gray-600">Visibility</div>
          </div>
        </motion.div>
      )}

      {/* Popular Cities */}
      {popularCities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <PopularCities />
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
