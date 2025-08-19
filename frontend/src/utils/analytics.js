// src/utils/analytics.js
export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", eventName, params);
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log("GA event (not sent):", eventName, params);
    }
  }
}