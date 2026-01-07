# Weather App (React + Vite)

Quick scaffolded React app using Vite (JavaScript) and OpenWeatherMap.

Setup (Windows, PowerShell):

1. Copy `.env.example` to `.env` and add your API key:

```powershell
cp .env.example .env
# then open .env and replace the placeholder with your API key (set VITE_WEATHER_API_KEY)
```

2. Install dependencies and start the dev server:

```powershell
npm install
npm run dev
```

3. Open the URL printed by Vite (usually http://localhost:5173).

Usage

- Search by city name or click "Use my location" to fetch by geolocation.
- The last searched city is saved to `localStorage` and loaded on start.

Notes

- The app reads `VITE_WEATHER_API_KEY` from `import.meta.env`.
- Get a free API key at https://openweathermap.org/api (Current Weather Data).
