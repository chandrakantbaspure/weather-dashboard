import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, RefreshCw } from 'lucide-react';
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
  const weatherClass = getWeatherBackground(current.description);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`weather-card ${weatherClass} text-white relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <div>
              <h2 className="text-xl font-semibold">{location.name}</h2>
              <p className="text-sm opacity-90">
                {location.state && `${location.state}, `}{location.country}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-1 text-sm opacity-90">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs opacity-75 mt-1">
              <RefreshCw className="w-3 h-3" />
              <span>
                {lastUpdated ? format(lastUpdated, 'HH:mm') : 'Just now'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Weather Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={getWeatherIcon(current.icon)}
                alt={current.description}
                className="weather-icon"
              />
            </motion.div>
            <div>
              <div className="temperature-large">
                {formatTemperature(current.temp)}
              </div>
              <div className="text-lg opacity-90 capitalize">
                {current.description}
              </div>
              <div className="text-sm opacity-75">
                Feels like {formatTemperature(current.feels_like)}
              </div>
            </div>
          </div>

          {/* Wind Info */}
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1 mb-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <div 
                  className="w-2 h-2 bg-white rounded-full"
                  style={{
                    transform: `rotate(${current.wind_deg}deg)`
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium">
                {getWindDirection(current.wind_deg)}
              </span>
            </div>
            <div className="text-sm opacity-90">
              {formatWindSpeed(current.wind_speed)}
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white border-opacity-20">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {current.humidity}%
            </div>
            <div className="text-sm opacity-90">Humidity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {current.pressure} hPa
            </div>
            <div className="text-sm opacity-90">Pressure</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
