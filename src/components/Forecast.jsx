import React from "react";

export default function Forecast({ days = [], units = "metric" }) {
  const unitSymbol = units === "imperial" ? "°F" : "°C";
  // ensure we only render up to 5 days
  const show = Array.isArray(days) ? days.slice(0, 5) : [];
  return (
    <div className="forecast" aria-label="5 day forecast">
      {show.map((d) => {
        const dt = new Date(d.dt * 1000);
        const weekday = dt.toLocaleDateString(undefined, { weekday: "short" });
        const icon = d.weather?.[0]?.icon;
        const desc = d.weather?.[0]?.description;
        const max = Math.round(d.temp?.max ?? d.temp?.day ?? 0);
        const min = Math.round(d.temp?.min ?? d.temp?.night ?? 0);
        return (
          <div className="forecast-card" key={d.dt}>
            <div className="forecast-date">{weekday}</div>
            {icon && (
              <img loading="lazy" src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={desc} />
            )}
            <div className="forecast-temp">{max}{unitSymbol} / {min}{unitSymbol}</div>
            <div className="forecast-desc">{desc}</div>
          </div>
        );
      })}
    </div>
  );
}
