import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { currentLocation } = useLocation();
  const { forecast, hourlyForecast, loading } = useWeather();

  // Temperature Chart Data
  const temperatureData = {
    labels: forecast?.map(day => new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })) || [],
    datasets: [
      {
        label: 'High Temperature (°C)',
        data: forecast?.map(day => Math.round(day.temp.max)) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
      },
      {
        label: 'Low Temperature (°C)',
        data: forecast?.map(day => Math.round(day.temp.min)) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Hourly Temperature Line Chart
  const hourlyData = {
    labels: hourlyForecast?.map(hour => new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', hour12: false })) || [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: hourlyForecast?.map(hour => Math.round(hour.temp)) || [],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Humidity Chart Data
  const humidityData = {
    labels: forecast?.map(day => new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })) || [],
    datasets: [
      {
        label: 'Humidity (%)',
        data: forecast?.map(day => day.humidity) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Wind Speed Chart Data
  const windData = {
    labels: forecast?.map(day => new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })) || [],
    datasets: [
      {
        label: 'Wind Speed (m/s)',
        data: forecast?.map(day => Math.round(day.wind_speed * 10) / 10) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Weather Conditions Distribution
  const weatherConditions = forecast?.reduce((acc, day) => {
    const condition = day.description.toLowerCase();
    acc[condition] = (acc[condition] || 0) + 1;
    return acc;
  }, {}) || {};

  const conditionsData = {
    labels: Object.keys(weatherConditions).map(condition => 
      condition.charAt(0).toUpperCase() + condition.slice(1)
    ),
    datasets: [
      {
        data: Object.values(weatherConditions),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weather Analytics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Hourly Temperature Trend',
      },
    },
  };

  if (!currentLocation) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Weather Analytics
        </h1>
        <p className="text-lg text-gray-600">
          Select a location to view detailed weather analytics and trends
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Analytics</h1>
        <p className="text-gray-600">
          Detailed weather analysis and trends for {currentLocation.name}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Temperature Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="weather-card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Forecast</h3>
              <Bar data={temperatureData} options={chartOptions} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="weather-card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Temperature</h3>
              <Line data={hourlyData} options={lineOptions} />
            </motion.div>
          </div>

          {/* Humidity and Wind Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="weather-card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Humidity Forecast</h3>
              <Bar data={humidityData} options={chartOptions} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="weather-card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wind Speed Forecast</h3>
              <Bar data={windData} options={chartOptions} />
            </motion.div>
          </div>

          {/* Weather Conditions Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="weather-card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Conditions Distribution</h3>
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut 
                  data={conditionsData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }} 
                />
              </div>
            </div>
          </motion.div>

          {/* Summary Statistics */}
          {forecast && forecast.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="weather-card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {Math.round(Math.max(...forecast.map(d => d.temp.max)))}°C
                  </div>
                  <div className="text-sm text-gray-600">Highest Temp</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {Math.round(Math.min(...forecast.map(d => d.temp.min)))}°C
                  </div>
                  <div className="text-sm text-gray-600">Lowest Temp</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {Math.round(forecast.reduce((acc, day) => acc + day.humidity, 0) / forecast.length)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Humidity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {Math.round(forecast.reduce((acc, day) => acc + day.wind_speed, 0) / forecast.length * 10) / 10} m/s
                  </div>
                  <div className="text-sm text-gray-600">Avg Wind Speed</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
