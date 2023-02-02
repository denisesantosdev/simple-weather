import { handleChangeDegreeCheckbox } from "./callbacks.js";
import { getURL } from "./getURLs.js";
import { getData, getElements } from "./instanceFactories.js";
import { TEXT } from "./texts.js";
import {
  createForecastDayCards,
  getErrorHandler,
  getSuccessHandler,
  getTodayTexts,
  getWeatherData,
  hydrateElements,
  printDayMetrics,
  retrieveChosenMetric,
  setBodyHTML,
} from "./utils.js";

window.addEventListener("load", () => {
  localStorage.hasOwnProperty("location") ? retrieveUserLocation() : getUserLocation();
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

function retrieveUserLocation() {
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
  const { maxTemp, minTemp, rainSum, weatherCode, time } = getData().getDailyData(data);

  scrollForecast(forecastSection);
  createForecastDayCards(forecastSection, maxTemp, weatherCode, time);
  printDayMetrics(maxTemp);
}

function displayTime() {
  const newDate = new Date();
  const { todayDate, dayAndHour } = getElements();
  const { getTodayDataText, getDayAndHourText } = getTodayTexts(newDate);

  todayDate.innerText = getTodayDataText();
  dayAndHour.innerText = getDayAndHourText();
}

export function toggleMetric(temperature, element) {
  const { degreeCheckbox } = getElements();

  degreeCheckbox.addEventListener("change", () => handleChangeDegreeCheckbox(temperature, element));
  retrieveChosenMetric(degreeCheckbox);

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

function switchColors() {
  const newDate = new Date();

  const hour = newDate.toLocaleString("en-us", { hourCycle: "h24", hour: "2-digit" }).slice(0, 2);

  const checkDayTime = () => {
    if (hour >= 5 && hour < 12) return "morning-clrs";
    if (hour >= 12 && hour <= 17) return "afternoon-clrs";
    if (hour > 17 && hour <= 24) return "night-clrs";
    if (hour >= 1 && hour < 5) return "night-clrs";
  };

  document.body.className = "";
  document.body.classList.add(checkDayTime());
}

switchColors();
