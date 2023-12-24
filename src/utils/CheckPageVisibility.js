/**
 * A helper function that checks if a page is visible based on current users permissions
 * Checks a page's displayData for hideForUsers, showForUsers and hideForGuests
 * Returns a boolean that determines if the user has the required permissions
 */

// Import helper functions from auth, to get current user, and check if guest
import { getCurrentUser } from '@/utils/Auth';
import { isVisibleToUser } from '@/utils/IsVisibleToUser';

/* Putting it all together, the function to export */
export const checkPageVisibility = (page) => {
  const currentUser = getCurrentUser(); // Get current user object
  const displayData = page.displayData || {};
  return isVisibleToUser(displayData, currentUser);
};

export default checkPageVisibility;
