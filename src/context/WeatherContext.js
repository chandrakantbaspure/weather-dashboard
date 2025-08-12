import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';

const WeatherContext = createContext();

const initialState = {
  currentWeather: null,
  forecast: null,
  hourlyForecast: null,
  loading: false,
  error: null,
  lastUpdated: null
};

const weatherReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CURRENT_WEATHER':
      return { 
        ...state, 
        currentWeather: action.payload, 
        loading: false, 
        error: null,
        lastUpdated: new Date()
      };
    case 'SET_FORECAST':
      return { 
        ...state, 
        forecast: action.payload.forecast,
        hourlyForecast: action.payload.hourly,
        loading: false, 
        error: null,
        lastUpdated: new Date()
      };
    case 'CLEAR_WEATHER':
      return { ...initialState };
    default:
      return state;
  }
};

export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  // OpenWeather API Key - in production, you'd want to use environment variables
  const API_KEY = '4d89c4ea09dae877556d12f55af98122';

  const fetchCurrentWeather = useCallback(async (location) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Get coordinates for location
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
      );

      if (!geoResponse.data.length) {
        throw new Error('Location not found');
      }

      const { lat, lon, name, country } = geoResponse.data[0];

      // Get current weather
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const weatherData = weatherResponse.data;
      
      // Format weather data
      const formattedWeather = {
        location: { name, lat, lon, country },
        current: {
          temp: weatherData.main.temp,
          feels_like: weatherData.main.feels_like,
          humidity: weatherData.main.humidity,
          pressure: weatherData.main.pressure,
          wind_speed: weatherData.wind.speed,
          wind_deg: weatherData.wind.deg,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          visibility: weatherData.visibility / 1000, // Convert to km
          uv_index: 0 // Will be fetched separately if needed
        }
      };

      dispatch({ type: 'SET_CURRENT_WEATHER', payload: formattedWeather });
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch weather data';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, []);

  const fetchForecast = useCallback(async (location) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Get coordinates for location
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
      );

      if (!geoResponse.data.length) {
        throw new Error('Location not found');
      }

      const { lat, lon } = geoResponse.data[0];

      // Get 5-day forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const forecastData = forecastResponse.data;
      
      // Process daily forecast (group by day)
      const dailyForecast = [];
      const dailyData = {};
      
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toDateString();
        
        if (!dailyData[day]) {
          dailyData[day] = {
            temps: [],
            humidity: [],
            wind_speed: [],
            descriptions: [],
            icons: []
          };
        }
        
        dailyData[day].temps.push(item.main.temp);
        dailyData[day].humidity.push(item.main.humidity);
        dailyData[day].wind_speed.push(item.wind.speed);
        dailyData[day].descriptions.push(item.weather[0].description);
        dailyData[day].icons.push(item.weather[0].icon);
      });

      // Calculate daily averages and get most common weather
      Object.keys(dailyData).forEach(day => {
        const data = dailyData[day];
        const avgTemp = data.temps.reduce((a, b) => a + b, 0) / data.temps.length;
        const avgHumidity = Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length);
        const avgWindSpeed = data.wind_speed.reduce((a, b) => a + b, 0) / data.wind_speed.length;
        
        // Get most common weather description and icon
        const descriptionCount = {};
        const iconCount = {};
        data.descriptions.forEach(desc => descriptionCount[desc] = (descriptionCount[desc] || 0) + 1);
        data.icons.forEach(icon => iconCount[icon] = (iconCount[icon] || 0) + 1);
        
        const mostCommonDesc = Object.keys(descriptionCount).reduce((a, b) => 
          descriptionCount[a] > descriptionCount[b] ? a : b
        );
        const mostCommonIcon = Object.keys(iconCount).reduce((a, b) => 
          iconCount[a] > iconCount[b] ? a : b
        );

        dailyForecast.push({
          date: new Date(day),
          temp: {
            max: Math.max(...data.temps),
            min: Math.min(...data.temps),
            avg: Math.round(avgTemp)
          },
          humidity: avgHumidity,
          wind_speed: avgWindSpeed,
          description: mostCommonDesc,
          icon: mostCommonIcon
        });
      });

      // Sort by date
      dailyForecast.sort((a, b) => a.date - b.date);

      // Get hourly forecast for next 24 hours
      const hourlyForecast = forecastData.list.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000),
        temp: item.main.temp,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }));

      dispatch({ 
        type: 'SET_FORECAST', 
        payload: {
          forecast: dailyForecast,
          hourly: hourlyForecast
        }
      });
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch forecast data';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, []);

  const fetchWeatherData = useCallback(async (location) => {
    await Promise.all([
      fetchCurrentWeather(location),
      fetchForecast(location)
    ]);
  }, [fetchCurrentWeather, fetchForecast]);

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWeatherBackground = (weatherDescription) => {
    const description = weatherDescription.toLowerCase();
    
    if (description.includes('clear') || description.includes('sun')) {
      return 'sunny-gradient';
    } else if (description.includes('cloud')) {
      return 'cloudy-gradient';
    } else if (description.includes('rain') || description.includes('drizzle')) {
      return 'rainy-gradient';
    } else if (description.includes('snow')) {
      return 'bg-gradient-to-br from-blue-200 to-blue-400';
    } else if (description.includes('thunder') || description.includes('storm')) {
      return 'bg-gradient-to-br from-purple-600 to-gray-800';
    }
    
    return 'weather-gradient';
  };

  const formatTemperature = (temp, unit = 'C') => {
    const roundedTemp = Math.round(temp);
    return `${roundedTemp}°${unit}`;
  };

  const formatWindSpeed = (speed, unit = 'm/s') => {
    return `${Math.round(speed * 10) / 10} ${unit}`;
  };

  const formatHumidity = (humidity) => {
    return `${humidity}%`;
  };

  const formatPressure = (pressure) => {
    return `${pressure} hPa`;
  };

  const formatVisibility = (visibility) => {
    return `${visibility} km`;
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const value = {
    ...state,
    fetchCurrentWeather,
    fetchForecast,
    fetchWeatherData,
    getWeatherIcon,
    getWeatherBackground,
    formatTemperature,
    formatWindSpeed,
    formatHumidity,
    formatPressure,
    formatVisibility,
    getWindDirection
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
