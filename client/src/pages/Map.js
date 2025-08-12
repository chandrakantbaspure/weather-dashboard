import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Cloud } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';

// Component to handle map center updates
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lon], 10);
    }
  }, [center, map]);
  
  return null;
}

const Map = () => {
  const { currentLocation, getCurrentLocation } = useLocation();
  const { currentWeather, fetchWeatherData } = useWeather();
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default to London
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLocation) {
      setMapCenter([currentLocation.lat, currentLocation.lon]);
    }
  }, [currentLocation]);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    setIsLoading(true);
    
    try {
      // Get location name from coordinates
      const response = await fetch(`/api/location/current?lat=${lat}&lon=${lng}`);
      const locationData = await response.json();
      
      if (locationData.name) {
        await fetchWeatherData(locationData.name);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = async () => {
    setIsLoading(true);
    await getCurrentLocation();
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Map</h1>
            <p className="text-gray-600">
              Interactive weather map - click anywhere to get weather information
            </p>
          </div>
          
          <button
            onClick={handleCurrentLocation}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2"
          >
            <Navigation className="w-4 h-4" />
            <span>My Location</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="weather-card p-0 overflow-hidden"
          >
            <div className="h-96 lg:h-[600px] relative">
              <MapContainer
                center={mapCenter}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                onClick={handleMapClick}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                <MapUpdater center={currentLocation} />
                
                {currentLocation && currentWeather && (
                  <Marker position={[currentLocation.lat, currentLocation.lon]}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {currentLocation.name}
                        </h3>
                        <div className="flex items-center justify-center mb-2">
                          <img
                            src={`https://openweathermap.org/img/wn/${currentWeather.current.icon}@2x.png`}
                            alt={currentWeather.current.description}
                            className="w-8 h-8"
                          />
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {Math.round(currentWeather.current.temp)}°C
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {currentWeather.current.description}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
              
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="loading-spinner mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading weather data...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Weather Information Panel */}
        <div className="space-y-6">
          {currentLocation && currentWeather ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="weather-card"
            >
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentLocation.name}
                </h2>
              </div>
              
              <div className="text-center mb-4">
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeather.current.icon}@2x.png`}
                  alt={currentWeather.current.description}
                  className="w-16 h-16 mx-auto mb-2"
                />
                <div className="text-3xl font-bold text-gray-900">
                  {Math.round(currentWeather.current.temp)}°C
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {currentWeather.current.description}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Feels like</span>
                  <span className="font-medium">{Math.round(currentWeather.current.feels_like)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Humidity</span>
                  <span className="font-medium">{currentWeather.current.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wind</span>
                  <span className="font-medium">{Math.round(currentWeather.current.wind_speed * 10) / 10} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pressure</span>
                  <span className="font-medium">{currentWeather.current.pressure} hPa</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="weather-card text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cloud className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Location Selected
              </h3>
              <p className="text-gray-600">
                Click on the map or use your current location to view weather information
              </p>
            </motion.div>
          )}

          {/* Map Instructions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="weather-card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Click anywhere on the map to get weather data for that location</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Use the "My Location" button to get weather for your current position</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Zoom in/out to explore different areas</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Map;
