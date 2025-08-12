import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  location = null,
  weather = null 
}) => {
  // Default values
  const defaultTitle = 'Weather Dashboard - Real-Time Weather Forecast & Interactive Maps';
  const defaultDescription = 'Get accurate real-time weather forecasts, hourly predictions, and interactive weather maps. Check current weather conditions, temperature, humidity, wind speed, and UV index for any location worldwide.';
  const defaultKeywords = 'weather, weather forecast, weather app, weather dashboard, current weather, temperature, humidity, wind speed, weather map, weather radar, 5-day forecast, hourly weather, weather conditions';
  const defaultImage = '/og-image.jpg';
  const defaultUrl = 'https://your-weather-dashboard.com/';

  // Dynamic content based on location and weather
  const dynamicTitle = location && weather 
    ? `${location.name} Weather - Current Conditions & 5-Day Forecast | Weather Dashboard`
    : title || defaultTitle;

  const dynamicDescription = location && weather
    ? `Get real-time weather for ${location.name}. Current temperature: ${Math.round(weather.current.temp)}°C, ${weather.current.description}. 5-day forecast, hourly updates, and weather maps.`
    : description || defaultDescription;

  const dynamicKeywords = location 
    ? `${location.name} weather, ${location.name} forecast, ${location.name} temperature, ${location.name} weather conditions, ${defaultKeywords}`
    : keywords || defaultKeywords;

  // Structured data for weather information
  const weatherStructuredData = location && weather ? {
    "@context": "https://schema.org",
    "@type": "WeatherForecast",
    "location": {
      "@type": "Place",
      "name": location.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": location.name,
        "addressCountry": location.country
      }
    },
    "temperature": {
      "@type": "QuantitativeValue",
      "value": weather.current.temp,
      "unitCode": "CEL"
    },
    "description": weather.current.description,
    "humidity": {
      "@type": "QuantitativeValue",
      "value": weather.current.humidity,
      "unitCode": "P1"
    },
    "windSpeed": {
      "@type": "QuantitativeValue",
      "value": weather.current.wind_speed,
      "unitCode": "MTS"
    },
    "dateIssued": new Date().toISOString(),
    "provider": {
      "@type": "Organization",
      "name": "Weather Dashboard",
      "url": "https://your-weather-dashboard.com/"
    }
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{dynamicTitle}</title>
      <meta name="title" content={dynamicTitle} />
      <meta name="description" content={dynamicDescription} />
      <meta name="keywords" content={dynamicKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:title" content={dynamicTitle} />
      <meta property="og:description" content={dynamicDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Weather Dashboard" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || defaultUrl} />
      <meta property="twitter:title" content={dynamicTitle} />
      <meta property="twitter:description" content={dynamicDescription} />
      <meta property="twitter:image" content={image || defaultImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url || defaultUrl} />
      
      {/* Weather-specific structured data */}
      {weatherStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(weatherStructuredData)}
        </script>
      )}
      
      {/* Additional weather-specific meta tags */}
      {location && (
        <>
          <meta name="geo.region" content={location.country} />
          <meta name="geo.placename" content={location.name} />
          <meta name="geo.position" content={`${location.lat};${location.lon}`} />
          <meta name="ICBM" content={`${location.lat}, ${location.lon}`} />
        </>
      )}
      
      {weather && (
        <>
          <meta name="weather:temperature" content={`${Math.round(weather.current.temp)}°C`} />
          <meta name="weather:condition" content={weather.current.description} />
          <meta name="weather:humidity" content={`${weather.current.humidity}%`} />
          <meta name="weather:wind-speed" content={`${weather.current.wind_speed} m/s`} />
        </>
      )}
    </Helmet>
  );
};

export default SEO;
