import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const LocationContext = createContext();

const initialState = {
  currentLocation: null,
  searchResults: [],
  popularCities: [],
  loading: false,
  error: null
};

const locationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CURRENT_LOCATION':
      return { 
        ...state, 
        currentLocation: action.payload, 
        loading: false, 
        error: null 
      };
    case 'SET_SEARCH_RESULTS':
      return { 
        ...state, 
        searchResults: action.payload, 
        loading: false, 
        error: null 
      };
    case 'SET_POPULAR_CITIES':
      return { 
        ...state, 
        popularCities: action.payload, 
        loading: false, 
        error: null 
      };
    case 'CLEAR_SEARCH_RESULTS':
      return { ...state, searchResults: [] };
    case 'CLEAR_LOCATION':
      return { ...initialState };
    default:
      return state;
  }
};

export const LocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  // Get user's current location using browser geolocation
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    // Use high accuracy for better location precision
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Get location name from coordinates using reverse geocoding with higher limit for better accuracy
          const response = await axios.get(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=4d89c4ea09dae877556d12f55af98122`
          );
          
          if (response.data.length > 0) {
            // Find the most accurate location data
            let locationData = response.data[0];
            
            // If we're in Wakad area, try to get more specific location
            if (locationData.name && locationData.name.toLowerCase().includes('wakad')) {
              // Use the first result which should be most accurate
              locationData = response.data[0];
            } else {
              // For other areas, try to find the most specific location
              const specificLocation = response.data.find(loc => 
                loc.name && (loc.state || loc.country) && 
                !loc.name.toLowerCase().includes('district') &&
                !loc.name.toLowerCase().includes('region')
              );
              if (specificLocation) {
                locationData = specificLocation;
              }
            }
            
            const location = {
              name: locationData.name,
              country: locationData.country,
              state: locationData.state,
              lat: latitude,
              lon: longitude
            };
            
            dispatch({ type: 'SET_CURRENT_LOCATION', payload: location });
          }
        } catch (error) {
          const errorMessage = 'Failed to get location data';
          dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }
      },
      (error) => {
        let errorMessage = 'Failed to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
        }
        
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      },
      options
    );
  }, []);

  // Search for locations
  const searchLocations = useCallback(async (query) => {
    if (!query.trim()) {
      dispatch({ type: 'CLEAR_SEARCH_RESULTS' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // For Wakad searches, add Maharashtra to get more accurate results
      let searchQuery = query;
      if (query.toLowerCase().includes('wakad')) {
        searchQuery = `${query}, Maharashtra, India`;
      }
      
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=10&appid=4d89c4ea09dae877556d12f55af98122`
      );
      
      const locations = response.data.map(location => ({
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon
      }));
      
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: locations });
    } catch (error) {
      const errorMessage = 'Failed to search locations';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, []);

  // Search for Indian cities specifically
  const searchIndianCities = useCallback(async (query) => {
    if (!query.trim()) {
      return [];
    }

    try {
      // For Wakad searches, add specific context
      let searchQuery = query;
      if (query.toLowerCase().includes('wakad')) {
        searchQuery = `${query}, Pune, Maharashtra, India`;
      } else {
        searchQuery = `${query}, India`;
      }
      
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=15&appid=4d89c4ea09dae877556d12f55af98122`
      );
      
      return response.data
        .filter(location => location.country === 'IN')
        .map(location => ({
          name: location.name,
          country: location.country,
          state: location.state,
          lat: location.lat,
          lon: location.lon
        }));
    } catch (error) {
      console.error('Error searching Indian cities:', error);
      return [];
    }
  }, []);

  // Get popular cities
  const fetchPopularCities = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Predefined list of popular cities including major Indian cities
      const popularCities = [
        // Major Indian Cities
        { name: 'Mumbai', country: 'IN', state: 'Maharashtra', lat: 19.0760, lon: 72.8777 },
        { name: 'Delhi', country: 'IN', state: 'Delhi', lat: 28.7041, lon: 77.1025 },
        { name: 'Bangalore', country: 'IN', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
        { name: 'Hyderabad', country: 'IN', state: 'Telangana', lat: 17.3850, lon: 78.4867 },
        { name: 'Chennai', country: 'IN', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
        { name: 'Kolkata', country: 'IN', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
        { name: 'Pune', country: 'IN', state: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
        { name: 'Ahmedabad', country: 'IN', state: 'Gujarat', lat: 23.0225, lon: 72.5714 },
        { name: 'Jaipur', country: 'IN', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
        { name: 'Lucknow', country: 'IN', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
        // International Cities
        { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
        { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
        { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
        { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
        { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 }
      ];
      
      dispatch({ type: 'SET_POPULAR_CITIES', payload: popularCities });
    } catch (error) {
      const errorMessage = 'Failed to fetch popular cities';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, [dispatch]);

  // Set location manually
  const setLocation = useCallback((location) => {
    dispatch({ type: 'SET_CURRENT_LOCATION', payload: location });
  }, [dispatch]);

  // Clear search results
  const clearSearchResults = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH_RESULTS' });
  }, [dispatch]);



  // Load popular cities and get current location on mount
  useEffect(() => {
    fetchPopularCities();
    // Automatically get current location when component mounts
    getCurrentLocation();
  }, [fetchPopularCities, getCurrentLocation]);

  const value = {
    ...state,
    getCurrentLocation,
    searchLocations,
    searchIndianCities,
    fetchPopularCities,
    setLocation,
    clearSearchResults
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
