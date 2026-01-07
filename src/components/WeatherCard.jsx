import React from "react";

export default function WeatherCard({ data, units = "metric" }) {
  const { name, sys, main, weather, wind } = data;
  const icon = weather?.[0]?.icon;
  const desc = weather?.[0]?.description;
  const unitSymbol = units === "imperial" ? "°F" : "°C";
  const windUnit = units === "imperial" ? "mph" : "m/s";
  return (
    <div className="card">
      <h2>
        {name}, {sys?.country}
      </h2>
      <div className="row">
        <div>
          <div className="temp">{Math.round(main?.temp)}{unitSymbol}</div>
          <div className="desc">{desc}</div>
        </div>
        {icon && (
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={desc}
          />
        )}
      </div>
      <div className="meta">
        <div>Feels: {Math.round(main?.feels_like)}{unitSymbol}</div>
        <div>Humidity: {main?.humidity}%</div>
        <div>Wind: {wind?.speed} {windUnit}</div>
      </div>
    </div>
  );
}
