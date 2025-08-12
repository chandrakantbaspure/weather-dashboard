import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Cloud, Wind, Droplets } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import { format } from 'date-fns';

const Forecast = () => {
  const { currentLocation } = useLocation();
  const { forecast, loading, error, fetchForecast } = useWeather();

  useEffect(() => {
    if (currentLocation && !forecast) {
      fetchForecast(currentLocation.name);
    }
  }, [currentLocation, forecast, fetchForecast]);

  if (loading && !forecast) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forecast data...</p>
        </div>
      </div>
    );
  }

  if (error && !forecast) {
    return (
      <div className="error-container">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Cloud className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Forecast</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => currentLocation && fetchForecast(currentLocation.name)}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentLocation) {
    return (
      <div className="welcome-container">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Weather Forecast
          </h1>
          <p className="text-lg text-gray-600">
            Select a location to view the 5-day weather forecast
          </p>
        </div>
      </div>
    );
  }

  if (!forecast || forecast.length === 0) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <p className="text-gray-600">No forecast data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="forecast-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">5-Day Forecast</h1>
        <p className="text-gray-600">
          Weather predictions for {currentLocation.name}, {currentLocation.country}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="weather-card p-4"
          >
            {/* Date */}
            <div className="text-center mb-3">
              <div className="text-base font-semibold text-gray-900 truncate">
                {format(new Date(day.date), 'EEE')}
              </div>
              <div className="text-xs text-gray-600">
                {format(new Date(day.date), 'MMM dd')}
              </div>
            </div>

            {/* Weather Icon */}
            <div className="text-center mb-3">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                className="w-12 h-12 mx-auto"
              />
              <div className="text-xs text-gray-600 capitalize truncate mt-1">
                {day.description}
              </div>
            </div>

            {/* Temperature */}
            <div className="text-center mb-3">
              <div className="text-xl font-bold text-gray-900">
                {Math.round(day.temp)}°C
              </div>
              <div className="text-xs text-gray-600">
                Feels like {Math.round(day.feels_like)}°C
              </div>
            </div>

            {/* Weather Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 min-w-0">
                  <Droplets className="w-3 h-3 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-600 truncate">Humidity</span>
                </div>
                <span className="font-semibold text-gray-900 ml-2 flex-shrink-0">{day.humidity}%</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 min-w-0">
                  <Wind className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 truncate">Wind</span>
                </div>
                <span className="font-semibold text-gray-900 ml-2 flex-shrink-0">{day.wind_speed} m/s</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 min-w-0">
                  <Cloud className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600 truncate">Pressure</span>
                </div>
                <span className="font-semibold text-gray-900 ml-2 flex-shrink-0">{day.pressure} hPa</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
