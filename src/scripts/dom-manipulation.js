import { createForecastDayCardHTML } from "./dom-element-creators.js";

export function printDayMetrics(temperature) {
  const { futureTemps } = getElements();

  for (let i = 0; i < futureTemps.length; i++) {
    futureTemps[i].innerText = toggleMetric(temperature[i], futureTemps[i]);
  }
}

export function setBodyHTML(newBodyHTML) {
  document.body.innerHTML = newBodyHTML;
}

export function setBodyClass(dayTime) {
  document.body.className = "";
  document.body.classList.add(dayTime);
}

export function hydrateElements(weatherData) {
  const { weatherDescription: wDesc } = getElements();
  const El = getElements();
  const wd = { ...weatherData };

  El.weatherImg.src = `img/weather-icons/${wd.icon}.svg`;
  El.mainTemp.innerText = toggleMetric(wd.temp, El.mainTemp);
  El.wind.innerText = `${wd.dataWind}Km/h`;
  El.hum.innerText = `${wd.humidity}%`;
  El.clouds.innerText = `${wd.dataCloudness}%`;
  El.weatherImg.alt = `${wd.description}`;
  El.userLocation.innerText = wd.dataLocation;
  wDesc.innerText = wd.description;
}

export function createForecastDayCards(forecastSection, maxTemp, weatherCode, time) {
  for (let i = 0; i < maxTemp.length; i++) {
    const newDate = new Date(time[i].replace(/-/g, "/"));
    const getForecastHTML = createForecastDayCardHTML(weatherCode[i], newDate);

    forecastSection.innerHTML += getForecastHTML;
  }
}