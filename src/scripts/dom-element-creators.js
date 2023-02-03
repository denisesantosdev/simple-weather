import { convertWeatherCode } from "./converters.js";

export function createForecastDayCardHTML(index, date) {
  return `
      <div class="forecast-day-card">
        <p><span class="future-temp"></span>°</p>
        <img src="../../assets/img/weather-icons/${convertWeatherCode(index)}.svg" alt="" />
        <p class="week-day">
        ${date.toLocaleString("en-us", { weekday: "short" })}
        </p>
        </div>
        `;
}
