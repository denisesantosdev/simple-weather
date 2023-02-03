export function getTodayTexts(date) {
  return {
    getTodayDataText: () =>
      date.toLocaleString("en-us", {
        dateStyle: "medium",
      }),
    getDayAndHourText: () =>
      `${date.toLocaleString("en-us", {
        weekday: "long",
      })} | ${date.toLocaleString("en-us", {
        timeStyle: "medium",
      })}`,
  };
}

export function getTodayTextsObject(date) {
  return {
    todayDataText: getTodayTexts(date).getTodayDataText(),
    dayAndHourText: getTodayTexts(date).getDayAndHourText(),
  };
}

export const TEXT = {
  error: {
    TEXT_NO_GEOLOCATION_BROWSER_SUPPORT: "Your browser does not support geolocation.",
  },
};
