import { getCurrentWeatherData, getForecastData, saveUserLocation } from "./app.js";

export function createLatitudeAndLongitude(position) {
    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    }
}

export function getErrorHandler() {
    return function(error) {
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
    return function(position) {
        const { latitude, longitude } = createLatitudeAndLongitude(position)
  
        saveUserLocation(latitude, longitude);
        getCurrentWeatherData(latitude, longitude);
        getForecastData(latitude, longitude);
      };
}

export function setBodyHTML(newBodyHTML) {
  document.body.innerHTML = newBodyHTML
}