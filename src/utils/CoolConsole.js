/* eslint no-console: ["error", { allow: ["log", "info"] }] */

export const welcomeMsg = () => {
  const v = process.env.VUE_APP_VERSION ? `V${process.env.VUE_APP_VERSION}` : '';
  console.log(`%cDashy  ${v} 🚀`, 'color:#00af87; background:#0b1021; font-size:1.5rem; padding: 0 0.5rem 0; margin: 1rem auto; font-family: Rockwell; border: 2px solid #00af87; border-radius: 4px;font-weight: bold; text-shadow: 1px 1px 1px #00af87bf;');
};

export const warningMsg = (message) => {
  console.info(
    `%c⚠️ Warning ⚠️%c \n${message} \n\n%c🐛If you have found a bug, please open a ticket on GitHub, at: https://git.io/JukXk`,
    "color:#ceb73f; background: #ceb73f33; font-size:1.2rem; padding:0.15rem; margin: 0.2rem auto 1rem auto; font-family: Rockwell, Tahoma, 'Trebuchet MS', Helvetica; border: 2px solid #ceb73f; border-radius: 4px; font-weight: bold; text-shadow: 1px 1px 1px #000000bf;",
    'font-weight: bold; font-size: 0.9rem;color: #ceb73f;',
    "color: #ceb73f; font-size: 0.6rem; font-family: Tahoma, 'Trebuchet MS', Helvetica;",
  );
};

export const raiseBug = () => {
  console.log('%c🐛If you have found a bug, raise an issue on GitHub, at:\nhttps://git.io/JukXk', "color:#dddd10; font-size: 14px; font-family: 'Trebuchet MS', Helvetica;");
};
