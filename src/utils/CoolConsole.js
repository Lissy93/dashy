/* eslint no-console: ["error", { allow: ["log", "info"] }] */

export const welcomeMsg = () => {
  const v = process.env.VUE_APP_VERSION ? `V${process.env.VUE_APP_VERSION}` : '';
  console.log(`\n%cDashy  ${v} 🚀`, 'color:#0dd8d8; background:#0b1021; font-size:1.5rem; padding:0.15rem 0.25rem; margin: 1rem auto; font-family: Rockwell; border: 2px solid #0dd8d8; border-radius: 4px;font-weight: bold; text-shadow: 1px 1px 1px #00af87bf;');
};

export const warningMsg = (message) => {
  console.info(
    `\n%c⚠️ Warning ⚠️%c \n${message} \n\n%cThis is likely not an issue with Dashy, but rather your configuration. If you think it is a bug, please open a ticket on GitHub: https://git.io/JukXk`,
    "color:#ceb73f; background: #ceb73f33; font-size:1.5rem; padding:0.15rem; margin: 1rem auto; font-family: Rockwell, Tahoma, 'Trebuchet MS', Helvetica; border: 2px solid #ceb73f; border-radius: 4px; font-weight: bold; text-shadow: 1px 1px 1px #000000bf;",
    'font-weight: bold; font-size: 1rem;color: #ceb73f;',
    "color: #ceb73f; font-size: 0.75rem; font-family: Tahoma, 'Trebuchet MS', Helvetica;",
  );
};

export const raiseBug = () => {
  console.log('%c🐛If you have found a bug, raise an issue on GitHub, at:\nhttps://git.io/JukXk', "color:#dddd10; font-size: 14px; font-family: 'Trebuchet MS', Helvetica;");
};
