import { getCurrentWeatherData, getForecastData, saveUserLocation } from "../pages/Home/main.js";
import { getElements } from "./instance-factories.js";
import { createLatitudeAndLongitude } from "./utils.js";
import { celsiusToFahrenheit } from "./converters.js";
import { saveChosenMetric } from "./local-storage.js";

export function handleChangeDegreeCheckbox(temperature, element) {
  const { degree, degreeCheckbox } = getElements();

  if (degreeCheckbox.checked) {
    element.innerText = "";
    element.innerText = celsiusToFahrenheit(temperature).toFixed(0);
    degree.innerText = "°F";
  } else {
    element.innerText = "";
    element.innerText = temperature.toFixed(0);
    degree.innerText = "°C";
  }

  saveChosenMetric(degreeCheckbox);
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
