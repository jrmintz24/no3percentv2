import { getAnalytics, logEvent } from "firebase/analytics";
import { firebaseApp } from '../firebase/config';

let analytics = null;

// Initialize analytics in browser environments only
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(firebaseApp);
}

// Helper functions
export const trackEvent = (eventName, eventParams = {}) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  } else {
    console.log('Analytics event (dev):', eventName, eventParams);
  }
};

export const trackPageView = (pageName) => {
  trackEvent('page_view', { page_name: pageName });
};

export const trackSignUp = (userType) => {
  trackEvent('sign_up_click', { user_type: userType });
};

export const trackButtonClick = (buttonName, buttonLocation) => {
  trackEvent('button_click', { button_name: buttonName, location: buttonLocation });
};

export default {
  trackEvent,
  trackPageView,
  trackSignUp,
  trackButtonClick
};