import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cloud, Thermometer, Droplets, Wind, Loader, AlertTriangle, MapPin, Sunrise, Sunset, Gauge } from 'lucide-react';

const WeatherWidget = ({ location }) => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState("");
    const [activeTab, setActiveTab] = useState('today');

    useEffect(() => {
        console.log("WeatherWidget received raw location data:", JSON.stringify(location));
        
        let placeName = "";
        if (location) {
            if (typeof location === 'string') {
                placeName = location;
            } else if (location.placeName) {
                placeName = location.placeName;
            } else if (location.name) {
                placeName = location.name;
            } else if (location.address) {
                placeName = location.address;
            } else if (typeof location === 'object') {
                console.log("Examining location object properties...");
                const possibleLocationProps = ['place', 'city', 'town', 'destination', 'country', 'region'];
                
                for (const key of Object.keys(location)) {
                    console.log(`- Property ${key}:`, location[key]);
                    if (possibleLocationProps.includes(key.toLowerCase())) {
                        placeName = location[key];
                        console.log(`Found likely location name in property ${key}:`, placeName);
                        break;
                    }
                    
                    if (typeof location[key] === 'object' && location[key] !== null) {
                        console.log(`Checking nested property ${key}`);
                        const nestedObj = location[key];
                        
                        for (const nestedKey of Object.keys(nestedObj)) {
                            if (['name', 'placeName', 'address', 'city', 'town'].includes(nestedKey.toLowerCase())) {
                                placeName = nestedObj[nestedKey];
                                console.log(`Found location name in nested property ${key}.${nestedKey}:`, placeName);
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        if (!placeName && window.localStorage.getItem('lastLocationQuery')) {
            placeName = window.localStorage.getItem('lastLocationQuery');
            console.log("Using stored location from localStorage:", placeName);
        }
        
        console.log("Final extracted place name:", placeName || "Unknown");
        
        let cityName = placeName || "Dubai";
        
        if (cityName.includes(" - ")) {
            cityName = cityName.split(" - ")[0];
        } else if (cityName.includes(",")) {
            cityName = cityName.split(",")[0];
        }
        
        console.log("Using city name for API call:", cityName);
        
        setLocationName(placeName || "Unknown");
        
        const fetchWeatherData = async () => {
            if (!cityName) {
                console.error("Location missing or invalid:", location);
                setError(new Error("Location information is missing"));
                setLoading(false);
                return;
            }

            const apiKey = 'cc30a839e6de115635f396a84d807583';
            
            try {
                console.log("Fetching weather for location:", cityName);
                
                const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
                const currentResponse = await axios.get(currentWeatherUrl);
                console.log("Current weather received:", currentResponse.data);
                setCurrentWeather(currentResponse.data);
                
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
                const forecastResponse = await axios.get(forecastUrl);
                console.log("Forecast data received:", forecastResponse.data);
                setForecast(forecastResponse.data);
                
                window.localStorage.setItem('lastLocationQuery', cityName);
                
                setError(null);
            } catch (err) {
                console.error("Error fetching weather data:", err);
                
                if (cityName.includes("-") || cityName.includes(" ")) {
                    const simplifiedName = cityName.split(" ")[0].split("-")[0];
                    try {
                        console.log("Retrying with simplified city name:", simplifiedName);
                        
                        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${simplifiedName}&appid=${apiKey}&units=metric`;
                        const currentResponse = await axios.get(currentWeatherUrl);
                        setCurrentWeather(currentResponse.data);
                        
                        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${simplifiedName}&appid=${apiKey}&units=metric`;
                        const forecastResponse = await axios.get(forecastUrl);
                        setForecast(forecastResponse.data);
                        
                        window.localStorage.setItem('lastLocationQuery', simplifiedName);
                        setError(null);
                        return;
                    } catch (retryErr) {
                        console.error("Error on retry with simplified name:", retryErr);
                        setError(retryErr);
                    }
                }
                
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchWeatherData();
    }, [location]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-100">
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader className="animate-spin text-blue-600 mb-4" size={36} />
                    <p className="text-blue-800 font-medium">Loading weather information...</p>
                    <p className="text-blue-600 text-sm mt-1">Fetching data for {locationName || "your location"}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-lg border border-red-100">
                <div className="flex flex-col items-center justify-center h-64">
                    <AlertTriangle className="text-red-600 mb-4" size={36} />
                    <p className="text-red-800 font-medium">Unable to load weather information</p>
                    <p className="text-red-600 text-sm mt-1">Please check your connection or try again later</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const getWeatherIconUrl = (iconCode) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };
    
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const options = { weekday: 'short' };
        return date.toLocaleDateString('en-US', options);
    };
    
    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    const getDailyForecast = () => {
        if (!forecast) return [];
        
        const dailyData = {};
        const today = new Date().setHours(0, 0, 0, 0);
        
        forecast.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.setHours(0, 0, 0, 0);
            
            if (day === today) return;
            
            if (!dailyData[day]) {
                dailyData[day] = {
                    date: item.dt,
                    minTemp: item.main.temp_min,
                    maxTemp: item.main.temp_max,
                    icon: item.weather[0].icon,
                    description: item.weather[0].description
                };
            } else {
                dailyData[day].minTemp = Math.min(dailyData[day].minTemp, item.main.temp_min);
                dailyData[day].maxTemp = Math.max(dailyData[day].maxTemp, item.main.temp_max);
            }
        });
        
        return Object.values(dailyData).slice(0, 6);
    };

    const dailyForecast = getDailyForecast();

    const getHourlyForecast = () => {
        if (!forecast) return [];
        return forecast.list.slice(0, 8); // Next 24 hours (3-hour intervals)
    };

    const hourlyForecast = getHourlyForecast();

    return (
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-100">
            {/* Header with location and date */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="flex items-center">
                    <MapPin className="text-blue-600 mr-2" size={24} />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{locationName}</h2>
                        <p className="text-gray-600 text-sm">
                            {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="flex space-x-2 mt-3 sm:mt-0">
                    <button 
                        onClick={() => setActiveTab('today')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'today' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                    >
                        Today
                    </button>
                    <button 
                        onClick={() => setActiveTab('weekly')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'weekly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                    >
                        Weekly
                    </button>
                    <button 
                        onClick={() => setActiveTab('hourly')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'hourly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                    >
                        Hourly
                    </button>
                </div>
            </div>
            
            {/* Current Weather Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <img 
                            src={getWeatherIconUrl(currentWeather.weather[0].icon)} 
                            alt={currentWeather.weather[0].description}
                            className="w-20 h-20"
                        />
                        <div className="ml-4">
                            <p className="text-4xl font-bold text-gray-900">
                                {Math.round(currentWeather.main.temp)}°C
                            </p>
                            <p className="text-gray-600 capitalize">
                                {currentWeather.weather[0].description}
                            </p>
                            <p className="text-gray-500 text-sm">
                                Feels like {Math.round(currentWeather.main.feels_like)}°C
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <Thermometer className="text-blue-600 mr-2" size={18} />
                            <div>
                                <p className="text-xs text-gray-500">High/Low</p>
                                <p className="font-medium text-gray-900">
                                    {Math.round(currentWeather.main.temp_max)}°/{Math.round(currentWeather.main.temp_min)}°
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Droplets className="text-blue-600 mr-2" size={18} />
                            <div>
                                <p className="text-xs text-gray-500">Humidity</p>
                                <p className="font-medium text-gray-900">
                                    {currentWeather.main.humidity}%
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Wind className="text-blue-600 mr-2" size={18} />
                            <div>
                                <p className="text-xs text-gray-500">Wind</p>
                                <p className="font-medium text-gray-900">
                                    {Math.round(currentWeather.wind.speed * 3.6)} km/h
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Gauge className="text-blue-600 mr-2" size={18} />
                            <div>
                                <p className="text-xs text-gray-500">Pressure</p>
                                <p className="font-medium text-gray-900">
                                    {currentWeather.main.pressure} hPa
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Sunrise/Sunset */}
                {currentWeather.sys && (
                    <div className="flex justify-center space-x-8 mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center">
                            <Sunrise className="text-yellow-500 mr-2" size={18} />
                            <div>
                                <p className="text-xs text-gray-500">Sunrise</p>
                                <p className="font-medium text-gray-900">
                                    {formatTime(currentWeather.sys.sunrise)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Sunset className="text-orange-500 mr-2" size={18} />
                            <div>
                                <p className="text-xs text-gray-500">Sunset</p>
                                <p className="font-medium text-gray-900">
                                    {formatTime(currentWeather.sys.sunset)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Tab Content */}
            {activeTab === 'today' && (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Forecast</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                        {hourlyForecast.map((hour, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <p className="text-sm text-gray-600">
                                    {index === 0 ? 'Now' : formatTime(hour.dt)}
                                </p>
                                <img 
                                    src={getWeatherIconUrl(hour.weather[0].icon)} 
                                    alt={hour.weather[0].description}
                                    className="w-10 h-10 my-1"
                                />
                                <p className="font-medium text-gray-900">
                                    {Math.round(hour.main.temp)}°
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeTab === 'weekly' && (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Forecast</h3>
                    <div className="space-y-4">
                        {dailyForecast.map((day, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <p className="text-gray-700 font-medium w-24">
                                    {formatDate(day.date)}
                                </p>
                                <div className="flex items-center">
                                    <img 
                                        src={getWeatherIconUrl(day.icon)} 
                                        alt={day.description}
                                        className="w-8 h-8 mx-2"
                                    />
                                    <p className="text-gray-600 text-sm capitalize w-32">
                                        {day.description}
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    <p className="text-gray-900 font-medium">
                                        {Math.round(day.maxTemp)}°
                                    </p>
                                    <p className="text-gray-500">
                                        {Math.round(day.minTemp)}°
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {activeTab === 'hourly' && (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Forecast</h3>
                    <div className="overflow-x-auto">
                        <div className="flex space-x-6 pb-2">
                            {forecast.list.slice(0, 12).map((hour, index) => (
                                <div key={index} className="flex flex-col items-center min-w-[70px]">
                                    <p className="text-sm text-gray-600">
                                        {index === 0 ? 'Now' : formatTime(hour.dt)}
                                    </p>
                                    <img 
                                        src={getWeatherIconUrl(hour.weather[0].icon)} 
                                        alt={hour.weather[0].description}
                                        className="w-10 h-10 my-2"
                                    />
                                    <p className="font-medium text-gray-900 mb-1">
                                        {Math.round(hour.main.temp)}°
                                    </p>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Droplets className="mr-1" size={12} />
                                        {hour.main.humidity}%
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <Wind className="mr-1" size={12} />
                                        {Math.round(hour.wind.speed * 3.6)} km/h
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Footer */}
            <div className="mt-4 text-xs text-gray-500 text-center">
                Data provided by OpenWeatherMap • Last updated: {new Date().toLocaleTimeString()}
            </div>
        </div>
    );
};

export default WeatherWidget;