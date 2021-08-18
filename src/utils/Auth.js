import sha256 from 'crypto-js/sha256';
import { cookieKeys, localStorageKeys, userStateEnum } from './defaults';

/**
 * Generates a 1-way hash, in order to be stored in local storage for authentication
 * @param {String} user The username of user
 * @returns {String} The hashed token
 */
const generateUserToken = (user) => {
  const strAndUpper = (input) => input.toString().toUpperCase();
  const sha = sha256(strAndUpper(user.user) + strAndUpper(user.hash));
  return strAndUpper(sha);
};

/**
 * Checks if the user is currently authenticated
 * @param {Array[Object]} users An array of user objects pulled from the config
 * @returns {Boolean} Will return true if the user is logged in, else false
 */
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

/* Returns true if authentication is enabled */
export const isAuthEnabled = (users) => (users && users.length > 0);

/* Returns true if guest access is enabled */
export const isGuestAccessEnabled = (appConfig) => appConfig.enableGuestAccess || false;

/**
 * Checks credentials entered by the user against those in the config
 * Returns an object containing a boolean indicating success/ failure
 * along with a message outlining what's not right
 * @param {String} username The username entered by the user
 * @param {String} pass The password entered by the user
 * @param {String[]} users An array of valid user objects
 * @returns {Object} An object containing a boolean result and a message
 */
export const checkCredentials = (username, pass, users, messages) => {
  let response; // Will store an object containing boolean and message
  if (!username) {
    response = { correct: false, msg: messages.missingUsername };
  } else if (!pass) {
    response = { correct: false, msg: messages.missingPassword };
  } else {
    users.forEach((user) => {
      if (user.user.toLowerCase() === username.toLowerCase()) { // User found
        if (user.hash.toLowerCase() === sha256(pass).toString().toLowerCase()) {
          response = { correct: true, msg: messages.successMsg }; // Password is correct
        } else { // User found, but password is not a match
          response = { correct: false, msg: messages.incorrectPassword };
        }
      }
    });
  }
  return response || { correct: false, msg: messages.incorrectUsername };
};

/**
 * Sets the cookie value in order to login the user locally
 * @param {String} username - The users username
 * @param {String} pass - Password, not yet hashed
 * @param {Number} timeout - A desired timeout for the session, in ms
 */
export const login = (username, pass, timeout) => {
  const now = new Date();
  const expiry = new Date(now.setTime(now.getTime() + timeout)).toGMTString();
  const userObject = { user: username, hash: sha256(pass).toString().toLowerCase() };
  document.cookie = `authenticationToken=${generateUserToken(userObject)};`
    + `${timeout > 0 ? `expires=${expiry}` : ''}`;
  localStorage.setItem(localStorageKeys.USERNAME, username);
};

/**
 * Removed the browsers cookie, causing user to be logged out
 */
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
 * @param {String[]} - Array of users
 * @returns {Boolean} - True if admin privileges
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

/**
  * Determines which button should display, based on the user type
  * 0 = Auth not configured (don't show anything)
  * 1 = Auth configured, and user logged in (show logout button)
  * 2 = Auth configured, guest access enabled, not logged in (show login)
  * Note that if auth is enabled, but not guest access, and user not logged in,
  * then they will never be able to view the homepage, so no button needed
  */
export const getUserState = (appConfig) => {
  const { notConfigured, loggedIn, guestAccess } = userStateEnum; // Numeric enum options
  const users = appConfig.auth || []; // Get auth object
  if (!isAuthEnabled(users)) return notConfigured; // No auth enabled
  if (isLoggedIn(users)) return loggedIn; // User is logged in
  if (isGuestAccessEnabled(appConfig || {})) return guestAccess; // Guest is viewing
  return notConfigured;
};
