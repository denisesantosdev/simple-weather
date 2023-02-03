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

export const TEXT = {
  error: {
    TEXT_NO_GEOLOCATION_BROWSER_SUPPORT:
      'Your browser does not support geolocation.',
  },
};
