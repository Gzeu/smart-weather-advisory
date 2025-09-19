# 🌤️ Smart Weather Advisory API

> AI-Powered Weather Advisory cu recomandări personalizate pentru România

O API inteligentă care combină datele meteorologice cu analiza AI pentru a oferi sfaturi personalizate și recomandări practice despre vreme.

## 🌟 Features

- **☁️ Date Meteorologice Real-time** - Integrat cu OpenWeatherMap API
- **🤖 Analiză AI** - Recomandări inteligente folosind Groq AI
- **🌍 Suport România** - Optimizat pentru orașele din România
- **📈 Cache Inteligent** - Performance optimizat cu cache
- **🛑 Rate Limiting** - Protecție împotriva spam-ului
- **📊 Analytics** - Monitorizare și logging detaliat

## 🚀 Quick Start

### Prerequisite

- Node.js 18+
- npm sau yarn
- OpenWeatherMap API key
- Groq AI API key

### Instalare

```bash
# Clone repository
git clone https://github.com/Gzeu/smart-weather-advisory.git
cd smart-weather-advisory

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Editează .env cu API keys

# Start development server
npm run dev
```

### Configurare .env

```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
NODE_ENV=development
DEFAULT_CITY=Bucharest
DEFAULT_COUNTRY=RO
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 🌡️ Weather Data

**GET** `/api/weather/:city`
- Returnează vremea actuală pentru un oraș

```bash
curl http://localhost:3000/api/weather/Bucharest
```

**Response:**
```json
{
  "success": true,
  "data": {
    "city": "Bucharest",
    "country": "RO",
    "temperature": 22,
    "feelsLike": 24,
    "humidity": 65,
    "description": "cer senin",
    "windSpeed": 3.2
  },
  "timestamp": "2025-09-19T00:52:00.000Z"
}
```

**GET** `/api/weather/:city/forecast`
- Returnează prognoza pentru următoarele zile

#### 🤖 AI Advisory

**GET** `/api/advisory/:city`
- Recomandări AI bazate pe vremea actuală

```bash
curl "http://localhost:3000/api/advisory/Bucharest?activity=plimbare"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "weather": { ... },
    "advisory": {
      "recommendation": "Vremea este perfectă pentru o plimbare...",
      "alerts": [],
      "activities": {
        "outdoor": ["plimbare în parc", "ciclism"],
        "indoor": []
      },
      "clothing": ["tricou", "jachetă ușoară"],
      "confidence": 85
    }
  }
}
```

**POST** `/api/advisory/:city/recommendations`
- Recomandări personalizate bazate pe profil

```bash
curl -X POST http://localhost:3000/api/advisory/Bucharest/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "userProfile": {
      "age": 30,
      "preferences": ["outdoor", "sports"],
      "healthConditions": []
    },
    "plannedActivities": ["jogging", "cafenea"]
  }'
```

#### 📊 Health Check

**GET** `/health`
- Status API și uptime

## 🛠️ Development

### Scripts Disponibile

```bash
# Development cu hot reload
npm run dev

# Production build
npm run build

# Start production
npm start

# Run tests
npm test

# Linting
npm run lint

# Format code
npm run format

# Deploy pe Vercel
npm run deploy
```

### Structura Proiectului

```
smart-weather-advisory/
├── src/
│   ├── index.js           # Entry point
│   ├── routes/
│   │   ├── weather.js      # Weather endpoints
│   │   └── advisory.js     # AI advisory endpoints
│   ├── services/
│   │   ├── WeatherService.js   # OpenWeatherMap integration
│   │   └── AdvisoryService.js  # Groq AI integration
│   ├── middleware/
│   │   ├── errorHandler.js     # Error handling
│   │   ├── rateLimiter.js      # Rate limiting
│   │   └── validators.js       # Input validation
│   └── utils/
│       └── helpers.js          # Utility functions
├── scripts/
│   └── build.js           # Build script
├── package.json
├── vercel.json           # Vercel deployment config
├── .env.example
└── README.md
```

## 🌍 Deployment

### Vercel (Recomandat)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables (Production)

```env
OPENWEATHER_API_KEY=your_production_key
GROQ_API_KEY=your_production_key
NODE_ENV=production
PORT=3000
CACHE_TTL=300
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

## 📋 Usage Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function getWeatherAdvisory(city) {
  try {
    const response = await axios.get(`http://localhost:3000/api/advisory/${city}`);
    console.log(response.data.data.advisory.recommendation);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

getWeatherAdvisory('Cluj-Napoca');
```

### Python

```python
import requests

def get_weather_advisory(city):
    url = f'http://localhost:3000/api/advisory/{city}'
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return data['data']['advisory']['recommendation']
    else:
        return f'Error: {response.json()["message"]}'

advice = get_weather_advisory('Timișoara')
print(advice)
```

### cURL

```bash
# Vremea actuală
curl "http://localhost:3000/api/weather/Bucharest"

# Prognoza
curl "http://localhost:3000/api/weather/Bucharest/forecast?days=3"

# Recomandări AI
curl "http://localhost:3000/api/advisory/Bucharest?activity=ciclism"
```

## 🔒 Security Features

- **Rate Limiting** - Maxim 100 requests per 15 minute
- **Input Validation** - Sanitizare input-uri
- **Error Handling** - Mesaje de eroare securizate
- **CORS** - Cross-origin request protection
- **Helmet** - Security headers
- **Environment Variables** - API keys securizate

## 📋 Monitoring & Logging

- Structured logging cu timestamps
- API usage tracking
- Error monitoring
- Performance metrics
- Cache hit/miss statistics

## 🐛 Known Issues & Limitations

- Cache TTL fix la 5 minute
- Rate limiting doar în memorie (resetare la restart)
- Suport limitat pentru orașe internaționale
- Dependency pe servicii externe (OpenWeather, Groq)

## 🛣️ Roadmap

- [ ] WebSocket support pentru real-time updates
- [ ] Database integration pentru user profiles
- [ ] Mobile app companion
- [ ] Webhook notifications
- [ ] Multi-language support
- [ ] Weather maps integration
- [ ] Historical data analysis

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📜 License

MIT License - vezi [LICENSE](LICENSE) pentru detalii.

## 📧 Contact

**George Pricop** - [@Gzeu](https://github.com/Gzeu)

Project Link: [https://github.com/Gzeu/smart-weather-advisory](https://github.com/Gzeu/smart-weather-advisory)

---

🇷🇴 Made with ❤️ in Romania
