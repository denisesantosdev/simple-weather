import { getWeatherData } from "../../scripts/api.js";
import {
  createForecastDayCards,
  hydrateElements,
  printDayMetrics,
  setBodyClass,
  setBodyHTML,
  setDisplayTime,
} from "../../scripts/dom-manipulation.js";
import { getTodayTextsObject } from "../../scripts/get-texts.js";
import { getURL } from "../../scripts/get-URLs.js";
import { getErrorHandler, getSuccessHandler, handleChangeDegreeCheckbox } from "../../scripts/handlers.js";
import { getElements } from "../../scripts/instance-factories.js";
import { fetchChosenMetric } from "../../scripts/local-storage.js";
import { checkDayTime, getDailyData } from "../../scripts/utils.js";

window.addEventListener("load", () => {
  localStorage.hasOwnProperty("location") ? fetchUserLocation() : getUserLocation();
});

function getUserLocation() {
  if (navigator.geolocation) {
    const success = getSuccessHandler();
    const error = getErrorHandler();
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    setBodyHTML(TEXT.error.TEXT_NO_GEOLOCATION_BROWSER_SUPPORT);
  }
}

export function getCurrentWeatherData(latitude, longitude) {
  const apiURL = getURL["data"](latitude, longitude);

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => displayData(data))
    .catch((error) => console.error(error));
}

export function getForecastData(latitude, longitude) {
  const apiURL = getURL["forest"](latitude, longitude);

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => displayForecast(data))
    .catch((error) => console.error(error));
}

export function saveUserLocation(lat, long) {
  localStorage.setItem("location", JSON.stringify([lat, long]));
}

function fetchUserLocation() {
  const savedLocation = JSON.parse(localStorage.getItem("location"));
  const [latitude, longitude] = savedLocation;

  getCurrentWeatherData(latitude, longitude);
  getForecastData(latitude, longitude);
}

function displayData(data) {
  const weatherData = getWeatherData(data);
  hydrateElements(weatherData);
  setInterval(displayTime, 1000);
}

function displayForecast(data) {
  const { forecastSection } = getElements();
  const { maxTemp, minTemp, rainSum, weatherCode, time } = getDailyData(data);

  scrollForecast(forecastSection);
  createForecastDayCards(forecastSection, maxTemp, weatherCode, time);
  printDayMetrics(maxTemp);
}

function displayTime() {
  const newDate = new Date();
  const todayTexts = getTodayTextsObject(newDate);

  setDisplayTime(todayTexts);
}

export function toggleMetric(temperature, element) {
  const { degreeCheckbox } = getElements();

  degreeCheckbox.addEventListener("change", () => handleChangeDegreeCheckbox(temperature, element));
  fetchChosenMetric(degreeCheckbox);

  return temperature.toFixed(0);
}

function scrollForecast(element) {
  const { arrowLeft, arrowRight } = getElements();

  let scrollNumber = 0;

  arrowRight.addEventListener("click", () => {
    element.scroll({ top: 0, left: (scrollNumber += 20) });
  });

  arrowLeft.addEventListener("click", () => {
    element.scroll({ top: 0, left: (scrollNumber -= 20) });
  });
}

(function switchColors() {
  const newDate = new Date();
  const hour = newDate.toLocaleString("en-us", { hourCycle: "h24", hour: "2-digit" }).slice(0, 2);
  const dayTime = checkDayTime(hour);

  setBodyClass(dayTime);
})()