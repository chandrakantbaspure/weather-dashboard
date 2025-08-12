import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import { format } from 'date-fns';

const HourlyForecast = ({ forecast }) => {
  const { getWeatherIcon, formatTemperature, formatWindSpeed } = useWeather();

  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-4">
        {forecast.map((hour, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex-shrink-0 w-20 text-center"
          >
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              {/* Time */}
              <div className="text-sm font-medium text-gray-900 mb-2">
                {format(new Date(hour.time), 'HH:mm')}
              </div>
              
              {/* Weather Icon */}
              <div className="mb-2">
                <img
                  src={getWeatherIcon(hour.icon)}
                  alt={hour.description}
                  className="w-8 h-8 mx-auto"
                />
              </div>
              
              {/* Temperature */}
              <div className="text-lg font-bold text-gray-900 mb-1">
                {formatTemperature(hour.temp)}
              </div>
              
              {/* Description */}
              <div className="text-xs text-gray-600 mb-2 capitalize truncate">
                {hour.description}
              </div>
              
              {/* Wind Speed */}
              <div className="text-xs text-gray-500">
                {formatWindSpeed(hour.wind_speed)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
