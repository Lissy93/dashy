/**
 * A helper function that checks if an item is visible based on current users permissions
 * Checks an item displayData for hideForUsers, showForUsers and hideForGuests
 * Returns a boolean that determines if the user has the required permissions
 */

// Import helper functions from auth, to get current user, and check if guest
import { getCurrentUser } from '@/utils/Auth';
import { isVisibleToUser } from '@/utils/IsVisibleToUser';

/* Putting it all together, the function to export */
export const checkItemVisibility = (item) => {
  const currentUser = getCurrentUser(); // Get current user object
  const displayData = item.displayData || {};
  return isVisibleToUser(displayData, currentUser);
};

export default checkItemVisibility;
