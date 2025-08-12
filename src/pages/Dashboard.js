import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
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
import SEO from '../components/SEO';

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
      <>
        <SEO 
          title="Loading Weather Data - Weather Dashboard"
          description="Loading real-time weather information and forecasts for your location."
        />
        <div className="loading-container">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weather data...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && !currentWeather) {
    return (
      <>
        <SEO 
          title="Weather Error - Weather Dashboard"
          description="Unable to load weather data. Please try again or select a different location."
        />
        <div className="error-container">
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
      </>
    );
  }

  if (!currentLocation && !currentWeather) {
    return (
      <>
        <SEO 
          title="Weather Dashboard - Real-Time Weather Forecast & Interactive Maps"
          description="Get accurate real-time weather forecasts, hourly predictions, and interactive weather maps. Check current weather conditions, temperature, humidity, wind speed, and UV index for any location worldwide."
          keywords="weather dashboard, weather forecast, current weather, temperature, humidity, wind speed, weather map, weather app, weather conditions, weather data"
        />
        <div className="welcome-container">
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
      </>
    );
  }

  return (
    <>
      <SEO 
        location={currentLocation}
        weather={currentWeather}
        title={`${currentLocation?.name} Weather - Current Conditions & Forecast | Weather Dashboard`}
        description={`Get real-time weather for ${currentLocation?.name}. Current temperature: ${Math.round(currentWeather?.current?.temp)}°C, ${currentWeather?.current?.description}. 5-day forecast, hourly updates, and weather maps.`}
        keywords={`${currentLocation?.name} weather, ${currentLocation?.name} forecast, ${currentLocation?.name} temperature, weather conditions, weather dashboard`}
      />
      <div className="dashboard-container">
        {/* Current Weather Section */}
        {currentWeather && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WeatherCard weather={currentWeather} />
          </motion.div>
        )}

        {/* Hourly Forecast Section */}
        {hourlyForecast && hourlyForecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="weather-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Hourly Forecast</h2>
                <Clock className="w-6 h-6 text-gray-500" />
              </div>
              <HourlyForecast forecast={hourlyForecast} />
            </div>
          </motion.div>
        )}

        {/* Quick Stats Section */}
        {currentWeather && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="weather-card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {Math.round(currentWeather.current.temp)}°C
                  </div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {currentWeather.current.humidity}%
                  </div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {currentWeather.current.wind_speed} m/s
                  </div>
                  <div className="text-sm text-gray-600">Wind Speed</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {currentWeather.current.visibility} km
                  </div>
                  <div className="text-sm text-gray-600">Visibility</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Weather Details Section */}
        {currentWeather && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <WeatherDetails weather={currentWeather} />
          </motion.div>
        )}

        {/* Popular Cities Section */}
        {popularCities && popularCities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <PopularCities />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
