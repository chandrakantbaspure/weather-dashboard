import React from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Wind, 
  Eye, 
  Thermometer, 
  Gauge, 
  Sun,
  Compass
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
      bgColor: 'bg-red-50'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: formatHumidity(current.humidity),
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: formatWindSpeed(current.wind_speed),
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Compass,
      label: 'Wind Direction',
      value: getWindDirection(current.wind_deg),
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: formatPressure(current.pressure),
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: formatVisibility(current.visibility),
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="weather-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {details.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <motion.div
                key={detail.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
              >
                <div className={`p-2 rounded-lg ${detail.bgColor} mr-3 flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${detail.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {detail.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 ml-2 flex-shrink-0">
                      {detail.value}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* UV Index Card */}
      <div className="weather-card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Sun className="w-4 h-4 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">UV Index</h3>
            <p className="text-sm text-gray-600">Sun protection needed</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current</span>
            <span className="text-lg font-bold text-gray-900">
              {current.uv_index || 'N/A'}
            </span>
          </div>
          
          {/* UV Index Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((current.uv_index || 0) * 10, 100)}%` 
              }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Very High</span>
          </div>
        </div>
      </div>

      {/* Weather Description */}
      <div className="weather-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Conditions</h3>
        <div className="flex items-center space-x-3">
          <img
            src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
            alt={current.description}
            className="w-12 h-12"
          />
          <div>
            <p className="text-lg font-medium text-gray-900 capitalize">
              {current.description}
            </p>
            <p className="text-sm text-gray-600">
              {format(new Date(), 'EEEE, MMMM do')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
