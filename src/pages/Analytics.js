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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!currentLocation) {
    return (
      <div className="welcome-container">
        <div className="text-center py-12">
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
      </div>
    );
  }

  if (!forecast || forecast.length === 0) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <p className="text-gray-600">No analytics data available</p>
        </div>
      </div>
    );
  }

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

  // Weather Conditions Doughnut Chart
  const weatherConditions = forecast?.reduce((acc, day) => {
    const condition = day.description.toLowerCase();
    acc[condition] = (acc[condition] || 0) + 1;
    return acc;
  }, {}) || {};

  const conditionsData = {
    labels: Object.keys(weatherConditions),
    datasets: [
      {
        data: Object.values(weatherConditions),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="analytics-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Weather Analytics</h1>
            <p className="text-gray-600">
              Detailed weather analysis for {currentLocation.name}, {currentLocation.country}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="weather-card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Temperature Trends</h2>
          <div className="h-64">
            <Bar data={temperatureData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Hourly Temperature Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="weather-card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hourly Temperature</h2>
          <div className="h-64">
            <Line data={hourlyData} options={lineChartOptions} />
          </div>
        </motion.div>

        {/* Humidity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="weather-card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Humidity Levels</h2>
          <div className="h-64">
            <Bar data={humidityData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Wind Speed Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="weather-card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Wind Speed</h2>
          <div className="h-64">
            <Bar data={windData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Weather Conditions Doughnut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="weather-card lg:col-span-2"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Weather Conditions Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={conditionsData} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="weather-card mt-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(Math.max(...forecast.map(day => day.temp.max)))}°C
            </div>
            <div className="text-sm text-gray-600">Highest Temperature</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(Math.min(...forecast.map(day => day.temp.min)))}°C
            </div>
            <div className="text-sm text-gray-600">Lowest Temperature</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(forecast.reduce((acc, day) => acc + day.humidity, 0) / forecast.length)}%
            </div>
            <div className="text-sm text-gray-600">Average Humidity</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(forecast.reduce((acc, day) => acc + day.wind_speed, 0) / forecast.length * 10) / 10} m/s
            </div>
            <div className="text-sm text-gray-600">Average Wind Speed</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
