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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forecast data...</p>
        </div>
      </div>
    );
  }

  if (error && !forecast) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
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
      <div className="max-w-4xl mx-auto text-center py-12">
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
    );
  }

  if (!forecast || forecast.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No forecast data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {forecast.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="weather-card"
          >
            {/* Date */}
            <div className="text-center mb-4">
              <div className="text-lg font-semibold text-gray-900">
                {format(new Date(day.date), 'EEEE')}
              </div>
              <div className="text-sm text-gray-600">
                {format(new Date(day.date), 'MMM dd')}
              </div>
            </div>

            {/* Weather Icon */}
            <div className="text-center mb-4">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                className="w-16 h-16 mx-auto"
              />
              <p className="text-sm text-gray-600 capitalize mt-1">
                {day.description}
              </p>
            </div>

            {/* Temperature Range */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center space-x-4">
                <div>
                  <div className="text-2xl font-bold text-red-500">
                    {Math.round(day.temp.max)}°
                  </div>
                  <div className="text-xs text-gray-500">High</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">
                    {Math.round(day.temp.min)}°
                  </div>
                  <div className="text-xs text-gray-500">Low</div>
                </div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Humidity</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {day.humidity}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wind className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Wind</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(day.wind_speed * 10) / 10} m/s
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Forecast Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="weather-card mt-8"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Forecast Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {Math.round(Math.max(...forecast.map(d => d.temp.max)))}°
            </div>
            <div className="text-sm text-gray-600">Highest Temperature</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {Math.round(Math.min(...forecast.map(d => d.temp.min)))}°
            </div>
            <div className="text-sm text-gray-600">Lowest Temperature</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {Math.round(forecast.reduce((acc, day) => acc + day.humidity, 0) / forecast.length)}%
            </div>
            <div className="text-sm text-gray-600">Average Humidity</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Forecast;
