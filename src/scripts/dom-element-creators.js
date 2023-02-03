export function createForecastDayCardHTML(index, date) {
  return `
      <div class="forecast-day-card">
        <p><span class="future-temp"></span>°</p>
        <img src="img/weather-icons/${convertWeatherCode(index)}.svg" alt="" />
        <p class="week-day">
        ${date.toLocaleString("en-us", { weekday: "short" })}
        </p>
        </div>
        `;
}
