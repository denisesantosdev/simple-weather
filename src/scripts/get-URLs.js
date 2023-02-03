export const getURL = {
  data: (latitude, longitude) =>
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=acd9c2a897e120f483b1535bbafe6a34&units=metric`,
  forest: (latitude, longitude) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max&timezone=GMT&daily=temperature_2m_min&daily=weathercode&daily=windspeed_10m_max&daily=precipitation_sum`,
};
