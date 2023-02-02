import { getErrorHandler, getSuccessHandler } from './utils.js';

window.addEventListener('load', () => {
  localStorage.hasOwnProperty('location')
    ? retrieveUserLocation()
    : getUserLocation();
});

function getElements() {
  return {
    userLocation: document.querySelector('#location'),
    weatherImg: document.querySelector('.weather-section img'),
    mainTemp: document.querySelector('.temp h1'),
    weatherDescription: document.querySelector('.weather-description'),
    wind: document.querySelector('.wind'),
    hum: document.querySelector('.hum'),
    clouds: document.querySelector('.clouds'),
    forecastSection: document.querySelector('.forecast'),
    futureTemps: document.querySelectorAll('.future-temp'),
    todayDate: document.querySelector('.date'),
    dayAndHour: document.querySelector('.day-and-hour'),
    degreeCheckbox: document.querySelector('#metric'),
    degree: document.querySelector('.degree'),
    arrowRight: document.querySelector('.arrow-right'),
    arrowLeft: document.querySelector('.arrow-left'),
  };
}

function getUserLocation() {
  if (navigator.geolocation) {
    const success = getSuccessHandler();
    const error = getErrorHandler();

    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    document.body.innerHTML = 'Your browser does not support geolocation.';
  }
}

export function getCurrentWeatherData(lat, long) {
  const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=acd9c2a897e120f483b1535bbafe6a34&units=metric`;

  fetch(api)
    .then(response => {
      return response.json();
    })
    .then(data => {
      displayData(data);
    });
}

export function getForecastData(lat, long) {
  const api = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&daily=temperature_2m_max&timezone=GMT&daily=temperature_2m_min&daily=weathercode&daily=windspeed_10m_max&daily=precipitation_sum`;

  fetch(api)
    .then(response => {
      return response.json();
    })
    .then(data => {
      displayForecast(data);
    });
}

export function saveUserLocation(lat, long) {
  localStorage.setItem('location', JSON.stringify([lat, long]));
}

function retrieveUserLocation() {
  const savedLocation = JSON.parse(localStorage.getItem('location'));

  const [lat, long] = savedLocation;

  getCurrentWeatherData(lat, long);
  getForecastData(lat, long);
}

function displayData(data) {
  const El = getElements();

  const dataLocation = `${data.name}, ${data.sys.country}`;
  const { humidity, temp } = data.main;
  const { description, icon } = data.weather[0];
  const dataWind = data.wind.speed;
  const dataCloudness = data.clouds.all;

  El.userLocation.innerText = dataLocation;
  El.weatherImg.src = `img/weather-icons/${icon}.svg`;
  El.weatherImg.alt = `${description}`;
  El.mainTemp.innerText = toggleMetric(temp, El.mainTemp);
  El.weatherDescription.innerText = description;
  El.wind.innerText = `${dataWind}Km/h`;
  El.hum.innerText = `${humidity}%`;
  El.clouds.innerText = `${dataCloudness}%`;

  setInterval(displayTime, 1000);
}

function displayForecast(data) {
  const { forecastSection } = getElements();

  scrollForecast(forecastSection);

  const maxTemp = data.daily.temperature_2m_max;
  const minTemp = data.daily.temperature_2m_min;
  const rainSum = data.daily.precipitation_sum;
  const weatherCode = data.daily.weathercode;
  const time = data.daily.time;

  const convertWeatherCode = weathercode => {
    const codes = {
      0: '01d',
      1: '02d',
      2: '03d',
      3: '04d',
      45: '04d',
      61: '10d',
      63: '09d',
      65: '11d',
      80: '10d',
      81: '09d',
      82: '11d',
      95: '11d',
      96: '11d',
    };

    return codes[weathercode];
  };

  for (let i = 0; i < maxTemp.length; i++) {
    const newDate = new Date(time[i].replace(/-/g, '/'));

    forecastSection.innerHTML += `
    <div class="forecast-day-card">
      <p><span class="future-temp"></span>°</p>
      <img src="img/weather-icons/${convertWeatherCode(
        weatherCode[i]
      )}.svg" alt="" />
      <p class="week-day">
      ${newDate.toLocaleString('en-us', { weekday: 'short' })}
      </p>
    </div>
    `;
  }

  const { futureTemps } = getElements();

  for (let i = 0; i < futureTemps.length; i++) {
    futureTemps[i].innerText = toggleMetric(maxTemp[i], futureTemps[i]);
  }
}

function displayTime() {
  const newDate = new Date();

  const { todayDate, dayAndHour } = getElements();

  todayDate.innerText = newDate.toLocaleString('en-us', {
    dateStyle: 'medium',
  });

  dayAndHour.innerText = `${newDate.toLocaleString('en-us', {
    weekday: 'long',
  })} | ${newDate.toLocaleString('en-us', {
    timeStyle: 'medium',
  })}`;
}

function toggleMetric(temp, element) {
  const { degree, degreeCheckbox } = getElements();

  const celsiusToFahrenheit = () => {
    return temp * (9 / 5) + 32;
  };

  const saveChosenMetric = () => {
    const checkBoxState = degreeCheckbox.checked;

    localStorage.setItem('fahrenheit', JSON.stringify(checkBoxState));
  };

  const retrieveChosenMetric = () => {
    const checkBoxState = JSON.parse(localStorage.getItem('fahrenheit'));

    let changeEvent = new Event('change', {
      bubbles: false,
      cancelable: false,
    });

    if (checkBoxState) {
      degreeCheckbox.checked = true;
      degreeCheckbox.dispatchEvent(changeEvent);
    }
  };

  degreeCheckbox.addEventListener('change', () => {
    if (degreeCheckbox.checked) {
      element.innerText = '';
      element.innerText = celsiusToFahrenheit().toFixed(0);
      degree.innerText = '°F';
    } else {
      element.innerText = '';
      element.innerText = temp.toFixed(0);
      degree.innerText = '°C';
    }

    saveChosenMetric();
  });

  retrieveChosenMetric();

  return temp.toFixed(0);
}

function scrollForecast(element) {
  const { arrowLeft, arrowRight } = getElements();

  let scrollNumber = 0;

  arrowRight.addEventListener('click', () => {
    element.scroll({ top: 0, left: (scrollNumber += 20) });
  });

  arrowLeft.addEventListener('click', () => {
    element.scroll({ top: 0, left: (scrollNumber -= 20) });
  });
}

function switchColors() {
  const newDate = new Date();

  const hour = newDate
    .toLocaleString('en-us', { hourCycle: 'h24', hour: '2-digit' })
    .slice(0, 2);

  const checkDayTime = () => {
    if (hour >= 5 && hour < 12) return 'morning-clrs';
    if (hour >= 12 && hour <= 17) return 'afternoon-clrs';
    if (hour > 17 && hour <= 24) return 'night-clrs';
    if (hour >= 1 && hour < 5) return 'night-clrs';
  };

  document.body.className = '';
  document.body.classList.add(checkDayTime());
}

switchColors();
