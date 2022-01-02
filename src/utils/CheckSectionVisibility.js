/**
 * A helper function that filters all the sections based on current users permissions
 * Checks each sections displayData for hideForUsers, showForUsers and hideForGuests
 * Returns an array of sections that the current logged in user has permissions for
 */

// Import helper functions from auth, to get current user, and check if guest
import { getCurrentUser, isLoggedInAsGuest } from '@/utils/Auth';
import { localStorageKeys } from '@/utils/defaults';

/* Helper function, checks if a given testValue is found in the visibility list */
const determineVisibility = (visibilityList, testValue) => {
  let isFound = false;
  visibilityList.forEach((visibilityItem) => {
    if (visibilityItem.toLowerCase() === testValue.toLowerCase()) isFound = true;
  });
  return isFound;
};

/* Helper function, determines if two arrays have any intersecting elements
   (one or more items that are the same) */
const determineIntersection = (source = [], target = []) => {
  const intersections = source.filter(item => target.indexOf(item) !== -1);
  return intersections.length > 0;
};

/* Returns false if this section should not be rendered for the current user/ guest */
const isSectionVisibleToUser = (displayData, currentUser, isGuest) => {
  // Checks if user explicitly has access to a certain section
  const checkVisibility = () => {
    if (!currentUser) return true;
    const hideForUsers = displayData.hideForUsers || [];
    const cUsername = currentUser.user.toLowerCase();
    return !determineVisibility(hideForUsers, cUsername);
  };
  // Checks if user is explicitly prevented from viewing a certain section
  const checkHiddenability = () => {
    if (!currentUser) return true;
    const cUsername = currentUser.user.toLowerCase();
    const showForUsers = displayData.showForUsers || [];
    if (showForUsers.length < 1) return true;
    return determineVisibility(showForUsers, cUsername);
  };
  const checkKeycloakVisibility = () => {
    if (!displayData.hideForKeycloakUsers) return true;

    const { groups, roles } = JSON.parse(localStorage.getItem(localStorageKeys.KEYCLOAK_INFO) || '{}');
    const hideForGroups = displayData.hideForKeycloakUsers.groups || [];
    const hideForRoles = displayData.hideForKeycloakUsers.roles || [];

    return !(determineIntersection(hideForRoles, roles)
      || determineIntersection(hideForGroups, groups));
  };
  const checkKeycloakHiddenability = () => {
    if (!displayData.showForKeycloakUsers) return true;

    const { groups, roles } = JSON.parse(localStorage.getItem(localStorageKeys.KEYCLOAK_INFO) || '{}');
    const showForGroups = displayData.showForKeycloakUsers.groups || [];
    const showForRoles = displayData.showForKeycloakUsers.roles || [];

    return determineIntersection(showForRoles, roles)
      || determineIntersection(showForGroups, groups);
  };
  // Checks if the current user is a guest, and if section allows for guests
  const checkIfHideForGuest = () => {
    const hideForGuest = displayData.hideForGuests;
    return !(hideForGuest && isGuest);
  };
  return checkVisibility()
    && checkHiddenability()
    && checkIfHideForGuest()
    && checkKeycloakVisibility()
    && checkKeycloakHiddenability();
};

/* Putting it all together, the function to export */
const checkSectionVisibility = (sections) => {
  const currentUser = getCurrentUser(); // Get current user object
  const isGuest = isLoggedInAsGuest(); // Check if current user is a guest
  return sections.filter((currentSection) => {
    const displayData = currentSection.displayData || {};
    return isSectionVisibleToUser(displayData, currentUser, isGuest);
  });
};

export default checkSectionVisibility;
