import { hideFurnitureOn } from '@/utils/defaults';

/* Returns false if page furniture should be hidden on said route */
export const shouldBeVisible = (routeName) => !hideFurnitureOn.includes(routeName);

export const x = () => null;
