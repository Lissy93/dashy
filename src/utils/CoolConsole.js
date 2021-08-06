/* eslint no-console: ["error", { allow: ["log"] }] */

export const welcomeMsg = () => {
  const v = process.env.VUE_APP_VERSION ? `V${process.env.VUE_APP_VERSION}` : '';
  console.log(`%cDashy  ${v} 🚀`, 'color:#00af87; background:#0b1021; font-size:36px; padding: 0.5rem 0.5rem 0; margin: 1rem auto; font-family: Rockwell; border: 2px solid #00af87; border-radius: 4px;font-weight: bold; text-shadow: 1px 1px 1px #00af87bf;');
};

export const warningMsg = () => {
  console.log('%c⚠️ Error ⚠️', "background:#21bbca; color:#0b1021; font-size:20px; padding:0.25rem 0.5rem; margin: 1rem auto 0.25rem; font-family: 'Trebuchet MS', Helvetica; border: 2px solid yellow; border-radius: 4px; font-weight: bold;");
};

export const raiseBug = () => {
  console.log('%c🐛If you have found a bug, raise an issue on GitHub, at:\nhttps://git.io/JnqPR', "color:#dddd10; font-size: 14px; font-family: 'Trebuchet MS', Helvetica;");
};
