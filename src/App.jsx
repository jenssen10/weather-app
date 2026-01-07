import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState("metric"); // 'metric' or 'imperial'
  const [lastQuery, setLastQuery] = useState(null);
  const [lastCoords, setLastCoords] = useState(null);

  // load last search from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastSearch");
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved?.lastQuery) setLastQuery(saved.lastQuery);
      if (saved?.lastCoords) setLastCoords(saved.lastCoords);
    } catch (err) {
      // ignore parse errors
    }
  }, []);

  // persist last search when it changes
  useEffect(() => {
    try {
      const payload = { lastQuery, lastCoords };
      if (payload.lastQuery || payload.lastCoords) {
        localStorage.setItem("lastSearch", JSON.stringify(payload));
      } else {
        localStorage.removeItem("lastSearch");
      }
    } catch (err) {
      // ignore
    }
  }, [lastQuery, lastCoords]);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
  console.log("API KEY LOADED?", API_KEY);



  async function fetchForecast(lat, lon) {
    if (!lat || !lon) return;
    try {
      const key = API_KEY;
      if (!key) throw new Error("Missing API key. Set VITE_OPENWEATHER_KEY in .env.");
      const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${key}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      // take the next 5 days (daily[1..5])
      setForecast(data.daily?.slice(1, 6) || null);
    } catch (err) {
      // non-blocking for forecast
      console.warn("Forecast fetch failed", err);
    }
  }

  async function fetchWeather(q) {
    if (!q) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const key = API_KEY;
      if (!key) throw new Error("Missing API key. Set VITE_OPENWEATHER_KEY in .env.");
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=${units}&appid=${key}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
      setLastQuery(q);
      setLastCoords({ lat: data.coord.lat, lon: data.coord.lon });
      fetchForecast(data.coord.lat, data.coord.lon);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeatherByCoords(lat, lon) {
    if (!lat || !lon) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const key = API_KEY;
      if (!key) throw new Error("Missing API key. Set VITE_OPENWEATHER_KEY in .env.");
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Location not found");
      const data = await res.json();
      setWeather(data);
      setLastCoords({ lat, lon });
      setLastQuery(null);
      fetchForecast(lat, lon);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleGeolocate() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        fetchWeatherByCoords(lat, lon);
      },
      (err) => {
        setLoading(false);
        setError(err.message || "Unable to retrieve your location.");
      }
    );
  }

  function toggleUnits() {
    setUnits((u) => (u === "metric" ? "imperial" : "metric"));
  }

  // when units change, refetch for the last query/coords
  useEffect(() => {
    if (lastQuery) fetchWeather(lastQuery);
    else if (lastCoords) fetchWeatherByCoords(lastCoords.lat, lastCoords.lon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  return (
    <div className="app">
      <h1>Weather App</h1>

      <div className="toolbar">
        <Search value={city} onChange={(v) => setCity(v)} onSearch={() => fetchWeather(city)} />
        <div className="controls">
          <button className="toggle" onClick={toggleUnits}>Unit: {units === "metric" ? "°C" : "°F"}</button>
          <button className="geo" onClick={handleGeolocate}>Use my location</button>
        </div>
      </div>

      { (lastQuery || lastCoords) && (
        <div className="card" style={{display: 'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',marginBottom:'1rem'}}>
          <div style={{minWidth:0}}>
            <div style={{fontWeight:700}}>{lastQuery ? `Last: ${lastQuery}` : `Last: ${lastCoords?.lat.toFixed(2)}, ${lastCoords?.lon.toFixed(2)}`}</div>
            <div className="muted" style={{marginTop:4,fontSize:13}}>Click to re-run the previous search</div>
          </div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            {lastQuery && (
              <button className="controls-btn" onClick={() => fetchWeather(lastQuery)} disabled={loading} style={{padding:'.45rem .65rem',borderRadius:8,border:0,background:'var(--accent)',color:'#042027',fontWeight:600}}>Search again</button>
            )}
            {lastCoords && (
              <button className="controls-btn" onClick={() => fetchWeatherByCoords(lastCoords.lat, lastCoords.lon)} disabled={loading} style={{padding:'.45rem .65rem',borderRadius:8,border:'1px solid rgba(255,255,255,0.04)',background:'transparent',color:'var(--accent-2)',fontWeight:600}}>Use coords</button>
            )}
            <button onClick={() => { setLastQuery(null); setLastCoords(null); localStorage.removeItem('lastSearch'); }} style={{padding:'.45rem .65rem',borderRadius:8,border:'1px solid rgba(255,255,255,0.04)',background:'transparent',color:'var(--muted)'}}>Clear</button>
          </div>
        </div>
      )}

      {loading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {weather && <WeatherCard data={weather} units={units} />}
      {forecast && <Forecast days={forecast} units={units} />}

      <footer className="muted">Powered by OpenWeatherMap</footer>
    </div>
  );
}
