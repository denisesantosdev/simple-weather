export function celsiusToFahrenheit(temperature) {
  return temperature * (9 / 5) + 32;
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
