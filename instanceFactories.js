export function getData() {
  return {
    getDailyData,
    getElements,
  };
}

export function getDailyData(data) {
  return {
    maxTemp: data.daily.temperature_2m_max,
    minTemp: data.daily.temperature_2m_min,
    rainSum: data.daily.precipitation_sum,
    weatherCode: data.daily.weathercode,
    time: data.daily.time,
  };
}

export function getElements() {
  return {
    userLocation: document.querySelector("#location"),
    weatherImg: document.querySelector(".weather-section img"),
    mainTemp: document.querySelector(".temp h1"),
    weatherDescription: document.querySelector(".weather-description"),
    wind: document.querySelector(".wind"),
    hum: document.querySelector(".hum"),
    clouds: document.querySelector(".clouds"),
    forecastSection: document.querySelector(".forecast"),
    futureTemps: document.querySelectorAll(".future-temp"),
    todayDate: document.querySelector(".date"),
    dayAndHour: document.querySelector(".day-and-hour"),
    degreeCheckbox: document.querySelector("#metric"),
    degree: document.querySelector(".degree"),
    arrowRight: document.querySelector(".arrow-right"),
    arrowLeft: document.querySelector(".arrow-left"),
  };
}
