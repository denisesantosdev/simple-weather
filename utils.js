import { getCurrentWeatherData, getForecastData, saveUserLocation, toggleMetric } from "./app.js";
import { getElements } from "./instanceFactories.js";

export function createLatitudeAndLongitude(position) {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export function getErrorHandler() {
  return function (error) {
    switch (error.code) {
      case 1:
        alert("Please allow geolocation.");
        break;
      case 2:
        alert("Your location is unavailable.");
        break;
      case 3:
        alert("The request has timed out.");
        break;
      default:
        alert("An unknown error occurred.");
        break;
    }
  };
}

export function getSuccessHandler() {
  return function (position) {
    const { latitude, longitude } = createLatitudeAndLongitude(position);

    saveUserLocation(latitude, longitude);
    getCurrentWeatherData(latitude, longitude);
    getForecastData(latitude, longitude);
  };
}

export function setBodyHTML(newBodyHTML) {
  document.body.innerHTML = newBodyHTML;
}

export function getTodayTexts(date) {
  return {
    getTodayDataText: () =>
      date.toLocaleString("en-us", {
        dateStyle: "medium",
      }),
    getDayAndHourText: () =>
      `${date.toLocaleString("en-us", {
        weekday: "long",
      })} | ${date.toLocaleString("en-us", {
        timeStyle: "medium",
      })}`,
  };
}

export function convertWeatherCode(weathercode) {
  const codes = {
    0: "01d",
    1: "02d",
    2: "03d",
    3: "04d",
    45: "04d",
    61: "10d",
    63: "09d",
    65: "11d",
    80: "10d",
    81: "09d",
    82: "11d",
    95: "11d",
    96: "11d",
  };

  return codes[weathercode];
}

export function createForecastDayCards(forecastSection, maxTemp, weatherCode, time) {
  for (let i = 0; i < maxTemp.length; i++) {
    const newDate = new Date(time[i].replace(/-/g, "/"));

    forecastSection.innerHTML += `
    <div class="forecast-day-card">
      <p><span class="future-temp"></span>°</p>
      <img src="img/weather-icons/${convertWeatherCode(weatherCode[i])}.svg" alt="" />
      <p class="week-day">
      ${newDate.toLocaleString("en-us", { weekday: "short" })}
      </p>
      </div>
      `;
  }
}

export function printDayMetrics(temperature) {
  const { futureTemps } = getElements();

  for (let i = 0; i < futureTemps.length; i++) {
    futureTemps[i].innerText = toggleMetric(temperature[i], futureTemps[i]);
  }
}

export function celsiusToFahrenheit(temperature) {
  return temperature * (9 / 5) + 32;
}

export function saveChosenMetric(degreeCheckbox) {
  localStorage.setItem("fahrenheit", JSON.stringify(degreeCheckbox.checked));
}

export function retrieveChosenMetric(degreeCheckbox) {
  const checkBoxState = JSON.parse(localStorage.getItem("fahrenheit"));

  let changeEvent = new Event("change", {
    bubbles: false,
    cancelable: false,
  });

  if (checkBoxState) {
    degreeCheckbox.checked = true;
    degreeCheckbox.dispatchEvent(changeEvent);
  }
}

export function getWeatherData(data) {
  const { humidity, temp } = data.main;
  const { description, icon } = data.weather[0];
  return {
    dataLocation: `${data.name}, ${data.sys.country}`,
    dataWind: data.wind.speed,
    dataCloudness: data.clouds.all,
    description,
    icon,
    humidity,
    temp,
  };
}

// prettier-ignore
export function hydrateElements(weatherData) {
  const { weatherDescription: wDesc } = getElements();
  const El = getElements();
  const wd = { ...weatherData };

  El.weatherImg.src         = `img/weather-icons/${wd.icon}.svg`;
  El.mainTemp.innerText     = toggleMetric(wd.temp, El.mainTemp);
  El.wind.innerText         = `${wd.dataWind}Km/h`;
  El.hum.innerText          = `${wd.humidity}%`;
  El.clouds.innerText       = `${wd.dataCloudness}%`;
  El.weatherImg.alt         = `${wd.description}`;
  El.userLocation.innerText = wd.dataLocation;
  wDesc.innerText           = wd.description;
}
