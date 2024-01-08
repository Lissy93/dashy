import React, { useEffect } from 'react';

const CarbonAds = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//cdn.carbonads.com/carbon.js?serve=CWYIC53L&placement=dashyto';
    script.id = '_carbonads_js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
    <div id="carbonads"></div>
    <script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?serve=CWYIC53L&placement=dashyto" id="_carbonads_js"></script>
    </>
  );
};

export default CarbonAds;
