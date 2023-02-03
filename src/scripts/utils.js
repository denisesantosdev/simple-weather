export function createLatitudeAndLongitude(position) {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
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

export function checkDayTime(hour) {
  if (hour < 1 || hour > 24)
    throw new Error(`Invalid number! Hour must be between 1 and 24, but got ${hour}`);

  if (hour > 17) return "night-clrs";
  if (hour > 12) return "afternoon-clrs";
  if (hour > 6) return "morning-clrs";
  return "night-clrs";
}
