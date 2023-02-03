export function saveChosenMetric(degreeCheckbox) {
  localStorage.setItem("fahrenheit", JSON.stringify(degreeCheckbox.checked));
}

export function fetchChosenMetric(degreeCheckbox) {
  const checkBoxState = JSON.parse(localStorage.getItem("fahrenheit"));

  let changeEvent = new Event("change", {
    bubbles: false,
    cancelable: false,
  });

  if (checkBoxState) {
    degreeCheckbox.checked = true;
    degreeCheckbox.dispatchEvent(changeEvent);
  }
}
