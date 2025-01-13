// Cookie configuration with security options
const COOKIE_OPTIONS = 'Secure;SameSite=Strict;Path=/';

// Token name constants
const ACCESS_TOKEN = 'ps_access_token';
const REFRESH_TOKEN = 'ps_refresh_token';
const USER_DATA = 'ps_user_data';

// Helper function to set cookie with expiry
const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};${COOKIE_OPTIONS}`;
};

// Helper function to get cookie by name
const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Helper function to delete cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;${COOKIE_OPTIONS}`;
};

export const cookieUtils = {
  // Set access token in cookie
  setAccessToken: (token: string) => {
    setCookie(ACCESS_TOKEN, token, 7); // 7 days expiry
  },

  // Get access token from cookie
  getAccessToken: () => {
    return getCookie(ACCESS_TOKEN);
  },

  // Set refresh token in cookie
  setRefreshToken: (token: string) => {
    setCookie(REFRESH_TOKEN, token, 30); // 30 days expiry
  },

  // Get refresh token from cookie
  getRefreshToken: () => {
    return getCookie(REFRESH_TOKEN);
  },

  // Set user data in cookie
  setUserData: (data: any) => {
    setCookie(USER_DATA, JSON.stringify(data), 7);
  },

  // Get user data from cookie
  getUserData: () => {
    const data = getCookie(USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  // Clear all authentication cookies
  clearAuthCookies: () => {
    deleteCookie(ACCESS_TOKEN);
    deleteCookie(REFRESH_TOKEN);
    deleteCookie(USER_DATA);
  },

  // Check if user is authenticated based on cookie presence
  isAuthenticated: () => {
    return !!getCookie(ACCESS_TOKEN);
  },
};
