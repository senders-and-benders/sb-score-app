// src/AnalyticsTracker.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from '../utils/analytics';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackEvent("page_view", {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);

  return null;
}
