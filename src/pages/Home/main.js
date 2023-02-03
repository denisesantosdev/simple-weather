import { handleChangeDegreeCheckbox } from "../../scripts/callbacks.js";
import { getURL } from "../../scripts/get-URLs.js";
import { getData, getElements } from "../../scripts/instance-factories.js";
import { TEXT } from "../../scripts/texts.js";
import {
  checkDayTime,
  createForecastDayCards,
  getErrorHandler,
  getSuccessHandler,
  getTodayTexts,
  getWeatherData,
  hydrateElements,
  printDayMetrics,
  retrieveChosenMetric,
  setBodyClass,
  setBodyHTML,
} from "../../scripts/utils.js";

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
  const dayTime = checkDayTime(hour);

  setBodyClass(dayTime);
}

switchColors();
