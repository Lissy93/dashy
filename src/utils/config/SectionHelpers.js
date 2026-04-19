/* Helper functions for Sections and Items */

import { hideFurnitureOn } from '@/utils/defaults';

/* Returns false if page furniture should be hidden on said route */
export const shouldBeVisible = (routeName) => {
  let shouldShow = true;
  if (!routeName) return shouldShow; // Route name not specified.
  hideFurnitureOn.forEach((hideOn) => {
    // If route name on the no-show list, set visibility to false
    if (routeName.includes(hideOn)) shouldShow = false;
  });
  return shouldShow;
};

/* Based on section title, item name and index, return a string value for ID */
const makeItemId = (sectionStr, itemStr, index) => {
  const sectionTitle = sectionStr || `unlabeledSec_${Math.random()}`;
  const charSum = sectionTitle.split('').map((a) => a.charCodeAt(0)).reduce((x, y) => x + y);
  const newItemStr = itemStr || `unknown_${Math.random()}`;
  const itemTitleStr = newItemStr.replace(/\s+/g, '-').replace(/[^a-zA-Z ]/g, '').toLowerCase();
  return `${index}_${charSum}_${itemTitleStr}`;
};

/* Given an array of sections, apply a unique ID to each item, and return modified array */
export const applyItemId = (inputSections) => {
  const sections = inputSections || [];
  sections.forEach((sec, secIdx) => {
    if (sec.items) {
      sec.items.forEach((item, itemIdx) => {
        sections[secIdx].items[itemIdx].id = makeItemId(sec.name, item.title, itemIdx);
      });
    }
    if (sec.widgets) {
      sec.widgets.forEach((widget, widgetIdx) => {
        sections[secIdx].widgets[widgetIdx].id = makeItemId(sec.name, widget.type, widgetIdx);
      });
    }
  });
  return sections;
};
