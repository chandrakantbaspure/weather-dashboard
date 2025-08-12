import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';

const PopularCities = () => {
  const { popularCities, setLocation } = useLocation();
  const { fetchWeatherData } = useWeather();

  const handleCityClick = async (city) => {
    setLocation(city);
    await fetchWeatherData(city.name);
  };

  if (!popularCities || popularCities.length === 0) return null;

  // Separate Indian cities from international cities
  const indianCities = popularCities.filter(city => city.country === 'IN');
  const internationalCities = popularCities.filter(city => city.country !== 'IN');

  return (
    <div className="space-y-6">
      {/* Indian Cities Section */}
      <div className="weather-card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🇮🇳</span>
          <h3 className="text-lg font-semibold text-gray-900">Major Indian Cities</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {indianCities.map((city, index) => (
            <motion.button
              key={city.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleCityClick(city)}
              className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
            >
              <MapPin className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 group-hover:text-orange-700 transition-colors duration-200">
                  {city.name}
                </div>
                <div className="text-xs text-gray-500">
                  {city.state}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* International Cities Section */}
      <div className="weather-card">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🌍</span>
          <h3 className="text-lg font-semibold text-gray-900">International Cities</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {internationalCities.map((city, index) => (
            <motion.button
              key={city.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleCityClick(city)}
              className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
            >
              <MapPin className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors duration-200" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 group-hover:text-primary-700 transition-colors duration-200">
                  {city.name}
                </div>
                <div className="text-xs text-gray-500">
                  {city.country}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCities;
