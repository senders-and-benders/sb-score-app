// src/utils/analytics.js
export function trackEvent(eventName, params = {}) {
  // Always log in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.log("🔥 GA Event:", eventName, params);
    console.log("gtag available:", typeof window.gtag !== "undefined");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log('Skipping pushing event to GA')
    return;
  }

  // Send to GA if gtag is available
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", eventName, params);
  }
}