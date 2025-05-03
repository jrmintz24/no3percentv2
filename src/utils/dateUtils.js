// src/utils/dateUtils.js

/**
 * Format a time string (HH:MM) to a more readable format (HH:MM AM/PM)
 * @param {string} timeString - Time in HH:MM format (24-hour)
 * @returns {string} - Formatted time in HH:MM AM/PM format
 */
export const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // Parse hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    // Format minutes with leading zero if needed
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };
  
  /**
   * Format a date string (YYYY-MM-DD) to a more readable format
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @param {object} options - Formatting options to pass to toLocaleDateString
   * @returns {string} - Formatted date
   */
  export const formatDate = (dateString, options = {}) => {
    if (!dateString) return '';
    
    // Default options
    const defaultOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    const date = new Date(dateString);
    
    return date.toLocaleDateString('en-US', defaultOptions);
  };
  
  /**
   * Check if a date is in the past
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @returns {boolean} - True if the date is in the past, false otherwise
   */
  export const isPastDate = (dateString) => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    date.setHours(23, 59, 59, 999); // End of the day
    
    const today = new Date();
    
    return date < today;
  };