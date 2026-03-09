import React from 'react';
import DocSidebarDesktop from '@theme-original/DocSidebar/Desktop';
import CarbonAds from '@site/src/components/CarbonAd';

export default function DocSidebarDesktopWrapper(props) {
  return (
    <>
      <DocSidebarDesktop {...props} />
      <div className="sidebar-ad"><CarbonAds /></div>
    </>
  );
}
