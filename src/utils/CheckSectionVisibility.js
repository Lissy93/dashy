/**
 * A helper function that filters all the sections based on current users permissions
 * Checks each sections displayData for hideForUsers, showForUsers and hideForGuests
 * Returns an array of sections that the current logged in user has permissions for
 */

// Import helper functions from auth, to get current user, and check if guest
import { getCurrentUser, isLoggedInAsGuest } from '@/utils/Auth';

/* Helper function, checks if a given username appears in a user array */
const determineVisibility = (visibilityList, cUsername) => {
  let isFound = false;
  visibilityList.forEach((userInList) => {
    if (userInList.toLowerCase() === cUsername) isFound = true;
  });
  return isFound;
};

/* Returns false if this section should not be rendered for the current user/ guest */
const isSectionVisibleToUser = (displayData, currentUser, isGuest) => {
  // Checks if user explicitly has access to a certain section
  const checkVisiblity = () => {
    if (!currentUser) return true;
    const hideFor = displayData.hideForUsers || [];
    const cUsername = currentUser.user.toLowerCase();
    return !determineVisibility(hideFor, cUsername);
  };
  // Checks if user is explicitly prevented from viewing a certain section
  const checkHiddenability = () => {
    if (!currentUser) return true;
    const cUsername = currentUser.user.toLowerCase();
    const showForUsers = displayData.showForUsers || [];
    if (showForUsers.length < 1) return true;
    return determineVisibility(showForUsers, cUsername);
  };
  // Checks if the current user is a guest, and if section allows for guests
  const checkIfHideForGuest = () => {
    const hideForGuest = displayData.hideForGuests;
    return !(hideForGuest && isGuest);
  };
  return checkVisiblity() && checkHiddenability() && checkIfHideForGuest();
};

/* Putting it all together, the function to export */
const filterSectionVisibility = (sections) => {
  const currentUser = getCurrentUser(); // Get current user object
  const isGuest = isLoggedInAsGuest(); // Check if current user is a guest
  // const sectionsToReturn = [];
  // sections.forEach((currentSection) => {
  //   const displayData = currentSection.displayData || {};
  //   if (isSectionVisibleToUser(displayData, currentUser, isGuest)) {
  //     sectionsToReturn.push(currentSection);
  //   }
  // });

  const filteredSections = sections.filter((currentSection) => {
    const displayData = currentSection.displayData || {};
    return isSectionVisibleToUser(displayData, currentUser, isGuest);
  });

  return filteredSections;
};

export default filterSectionVisibility;
