// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return '';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

// Date validation
export const validateDate = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate + '-01');
  const end = new Date(endDate + '-01');
  if (start > end) return 'End date must be after start date';
  return '';
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return '';
};

// Phone validation (basic)
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\(\)\-\.]{10,}$/;
  if (!phone) return '';
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return '';
};

// URL validation
export const validateURL = (url) => {
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!url) return '';
  if (!urlRegex.test(url)) return 'Please enter a valid URL';
  return '';
};