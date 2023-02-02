import { getElements } from "./instanceFactories.js";
import { celsiusToFahrenheit, saveChosenMetric } from "./utils.js";

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
