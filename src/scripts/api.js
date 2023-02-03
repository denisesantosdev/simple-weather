export function getWeatherData(data) {
  const { humidity, temp } = data.main;
  const { description, icon } = data.weather[0];
  return {
    dataLocation: `${data.name}, ${data.sys.country}`,
    dataWind: data.wind.speed,
    dataCloudness: data.clouds.all,
    description,
    icon,
    humidity,
    temp,
  };
}
