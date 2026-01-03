# Weather App (React + Vite)

Quick scaffolded React app using Vite (JavaScript) and OpenWeatherMap.

Setup

1. Copy `.env.example` to `.env` and add your API key:

```bash
cp .env.example .env
# set VITE_WEATHER_API_KEY in .env
```

2. Install dependencies and run dev server:

```bash
npm install
npm run dev
```

Usage

- Search by city name or click "Use my location" to fetch by geolocation.
- The last searched city is saved to `localStorage` and loaded on start.

Notes

- Provide a `VITE_WEATHER_API_KEY` from OpenWeatherMap.
- This is a minimal scaffold — I can add forecast UI, unit toggle, tests, and deploy config next.
