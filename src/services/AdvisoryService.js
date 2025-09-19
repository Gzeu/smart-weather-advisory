import Groq from 'groq-sdk';
import { WeatherService } from './WeatherService.js';

class AdvisoryService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    this.weatherService = new WeatherService();
    
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Groq API key is required');
    }
  }

  async getWeatherAdvisory(city, options = {}) {
    try {
      // Get current weather data
      const weatherData = await this.weatherService.getCurrentWeather(city);
      const forecast = await this.weatherService.getForecast(city, 2);

      // Create AI prompt
      const prompt = this.createAdvisoryPrompt(weatherData, forecast, options);

      // Get AI analysis
      const completion = await this.groq.chat.completions.create({
        messages: [{
          role: 'user',
          content: prompt
        }],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 1024
      });

      const aiAdvice = completion.choices[0]?.message?.content;

      return {
        weather: weatherData,
        advisory: {
          recommendation: aiAdvice,
          alerts: this.generateAlerts(weatherData),
          activities: this.suggestActivities(weatherData, options.activity),
          clothing: this.suggestClothing(weatherData),
          confidence: this.calculateConfidence(weatherData)
        }
      };
    } catch (error) {
      throw new Error(`Advisory generation failed: ${error.message}`);
    }
  }

  createAdvisoryPrompt(weather, forecast, options) {
    return `
Analizează următoarele date meteorologice pentru ${weather.city}, România și oferă o recomandare detaliată în română:

**Vremea Actuală:**
- Temperatura: ${weather.temperature}°C (se simte ca ${weather.feelsLike}°C)
- Descriere: ${weather.description}
- Umiditate: ${weather.humidity}%
- Vânt: ${weather.windSpeed} m/s
- Vizibilitate: ${weather.visibility}m
- Răsărit: ${weather.sunrise.toLocaleTimeString('ro-RO')}
- Apus: ${weather.sunset.toLocaleTimeString('ro-RO')}

**Prognoză pe 48h:**
${forecast.forecasts.slice(0, 8).map(f => 
  `- ${f.datetime.toLocaleDateString('ro-RO')} ${f.datetime.toLocaleTimeString('ro-RO')}: ${f.temperature}°C, ${f.description}`
).join('\n')}

**Context:**
${options.activity ? `Activitate planificată: ${options.activity}` : ''}
${options.preferences ? `Preferințe: ${options.preferences}` : ''}

Oferă o recomandare practică și utilă care să includă:
1. Evaluarea condițiilor actuale
2. Sfaturi pentru îmbrăcăminte
3. Activități recomandate/de evitat
4. Precauții speciale
5. Perspective pentru următoarele ore

Răspunde în română, concis și practic.
    `.trim();
  }

  generateAlerts(weather) {
    const alerts = [];

    if (weather.temperature < 0) {
      alerts.push({ type: 'cold', message: 'Temperaturi negative - risc de îngheț' });
    }
    if (weather.temperature > 35) {
      alerts.push({ type: 'heat', message: 'Temperaturi extreme - risc de căldură' });
    }
    if (weather.windSpeed > 10) {
      alerts.push({ type: 'wind', message: 'Vânt puternic - atenție la deplasări' });
    }
    if (weather.visibility < 1000) {
      alerts.push({ type: 'visibility', message: 'Vizibilitate redusă - conduiți cu atenție' });
    }
    if (weather.humidity > 80) {
      alerts.push({ type: 'humidity', message: 'Umiditate ridicată - disconfort termic' });
    }

    return alerts;
  }

  suggestActivities(weather, plannedActivity) {
    const suggestions = {
      indoor: [],
      outdoor: []
    };

    // Weather-based activity suggestions
    if (weather.temperature >= 15 && weather.temperature <= 25 && weather.windSpeed < 5) {
      suggestions.outdoor.push('plimbare în parc', 'ciclism', 'picnic');
    }
    if (weather.temperature < 10 || weather.description.includes('ploaie')) {
      suggestions.indoor.push('muzeu', 'mall', 'cafenea', 'bibliotecă');
    }
    if (weather.temperature > 25) {
      suggestions.outdoor.push('piscină', 'terasă', 'parc cu umbră');
    }

    return suggestions;
  }

  suggestClothing(weather) {
    const clothing = [];

    if (weather.temperature < 5) {
      clothing.push('geacă groasă', 'căciulă', 'mănuși', 'încălțăminte călduroasă');
    } else if (weather.temperature < 15) {
      clothing.push('jachetă', 'pulover', 'pantaloni lungi');
    } else if (weather.temperature < 25) {
      clothing.push('tricou cu mânecă lungă', 'jachetă ușoară');
    } else {
      clothing.push('tricou', 'pantaloni scurți', 'pălărie de soare');
    }

    if (weather.description.includes('ploaie')) {
      clothing.push('umbrelă', 'impermeabil');
    }
    if (weather.windSpeed > 5) {
      clothing.push('jachetă rezistentă la vânt');
    }

    return clothing;
  }

  calculateConfidence(weather) {
    let confidence = 85; // Base confidence

    // Adjust based on data quality indicators
    if (weather.visibility < 5000) confidence -= 10;
    if (weather.windSpeed > 15) confidence -= 5;
    if (!weather.pressure) confidence -= 5;

    return Math.max(60, Math.min(95, confidence));
  }

  async getPersonalizedRecommendations(city, userProfile, plannedActivities) {
    const weatherData = await this.weatherService.getCurrentWeather(city);
    
    // Create personalized analysis based on user profile
    const personalizedPrompt = `
Creează recomandări personalizate pentru utilizatorul cu următorul profil:

**Profil Utilizator:**
${JSON.stringify(userProfile, null, 2)}

**Activități Planificate:**
${JSON.stringify(plannedActivities, null, 2)}

**Vremea în ${city}:**
Temperatura: ${weatherData.temperature}°C
Descriere: ${weatherData.description}
Umiditate: ${weatherData.humidity}%
Vânt: ${weatherData.windSpeed} m/s

Oferă recomandări specifice și personalizate în română.
    `;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: personalizedPrompt }],
      model: 'llama3-8b-8192',
      temperature: 0.8,
      max_tokens: 1024
    });

    return {
      weather: weatherData,
      personalizedAdvice: completion.choices[0]?.message?.content,
      userProfile,
      plannedActivities
    };
  }
}

export { AdvisoryService };
