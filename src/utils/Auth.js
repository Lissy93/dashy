import sha256 from 'crypto-js/sha256';
import { cookieKeys, localStorageKeys } from './defaults';

const generateUserToken = (user) => sha256(user.toString()).toString().toLowerCase();

export const isLoggedIn = (users) => {
  const validTokens = users.map((user) => generateUserToken(user));
  let userAuthenticated = false;
  document.cookie.split(';').forEach((cookie) => {
    if (cookie && cookie.split('=').length > 1) {
      const cookieKey = cookie.split('=')[0].trim();
      const cookieValue = cookie.split('=')[1].trim();
      if (cookieKey === cookieKeys.AUTH_TOKEN) {
        if (validTokens.includes(cookieValue)) {
          userAuthenticated = true;
        }
      }
    }
  });
  return userAuthenticated;
};

export const checkCredentials = (username, pass, users) => {
  let response;
  if (!username) {
    response = { correct: false, msg: 'Missing Username' };
  } else if (!pass) {
    response = { correct: false, msg: 'Missing Password' };
  } else {
    users.forEach((user) => {
      if (user.user === username) {
        if (user.hash.toLowerCase() === sha256(pass).toString().toLowerCase()) {
          response = { correct: true, msg: 'Logging in...' };
        } else {
          response = { correct: false, msg: 'Incorrect Password' };
        }
      }
    });
  }
  return response || { correct: false, msg: 'User not found' };
};

export const login = (username, pass) => {
  const userObject = { user: username, hash: sha256(pass).toString().toLowerCase() };
  document.cookie = `authenticationToken=${generateUserToken(userObject)}; max-age=600`;
  localStorage.setItem(localStorageKeys.USERNAME, username);
};

export const logout = () => {
  document.cookie = 'authenticationToken=null';
  localStorage.removeItem(localStorageKeys.USERNAME);
};

/**
 * Checks if the current user has admin privileges.
 * If no users are setup, then function will always return true
 * But if auth is configured, then will verify user is correctly
 * logged in and then check weather they are of type admin, and
 * return false if any conditions fail
 * @param users[] : Array of users
 * @returns Boolean : True if admin privileges
 */
export const isUserAdmin = (users) => {
  if (!users || users.length === 0) return true; // Authentication not setup
  if (!isLoggedIn(users)) return false; // Auth setup, but not signed in as a valid user
  const currentUser = localStorage[localStorageKeys.USERNAME];
  let isAdmin = false;
  users.forEach((user) => {
    if (user.user === currentUser) {
      if (user.type === 'admin') isAdmin = true;
    }
  });
  return isAdmin;
};
