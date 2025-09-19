import axios from 'axios';
import NodeCache from 'node-cache';

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 300 });
    
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is required');
    }
  }

  async getCurrentWeather(city) {
    const cacheKey = `weather_${city.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
          lang: 'ro'
        }
      });

      const weatherData = {
        city: response.data.name,
        country: response.data.sys.country,
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        windSpeed: response.data.wind.speed,
        windDirection: response.data.wind.deg,
        visibility: response.data.visibility,
        cloudiness: response.data.clouds.all,
        sunrise: new Date(response.data.sys.sunrise * 1000),
        sunset: new Date(response.data.sys.sunset * 1000),
        timestamp: new Date(response.data.dt * 1000)
      };

      this.cache.set(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`City '${city}' not found`);
      }
      throw new Error(`Weather API error: ${error.message}`);
    }
  }

  async getForecast(city, days = 5) {
    const cacheKey = `forecast_${city.toLowerCase()}_${days}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
          lang: 'ro',
          cnt: days * 8 // 8 forecasts per day (every 3 hours)
        }
      });

      const forecastData = {
        city: response.data.city.name,
        country: response.data.city.country,
        forecasts: response.data.list.map(item => ({
          datetime: new Date(item.dt * 1000),
          temperature: item.main.temp,
          feelsLike: item.main.feels_like,
          humidity: item.main.humidity,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          windSpeed: item.wind.speed,
          precipitation: item.rain ? item.rain['3h'] : 0
        }))
      };

      this.cache.set(cacheKey, forecastData);
      return forecastData;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`City '${city}' not found`);
      }
      throw new Error(`Forecast API error: ${error.message}`);
    }
  }
}

export { WeatherService };
