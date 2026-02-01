// Email validation (RFC 5321 compliant)
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) return false;
  if (email.length > 254) return false;
  const [local, domain] = email.split('@');
  if (local.length > 64) return false;
  if (domain.length > 255) return false;
  return true;
};

export const validatePassword = (pass) => pass && pass.length >= 8;

export const validateName = (name) => name && name.length >= 2 && name.length <= 100;

// Input sanitization - strips < > to prevent XSS
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 500);
};

export const sanitizeInput = (obj) => {
  if (!obj) return obj;
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};
