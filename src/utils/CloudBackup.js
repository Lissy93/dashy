/* eslint-disable */
import sha256 from 'crypto-js/sha256';
import aes from 'crypto-js/aes';
import Base64 from 'crypto-js/enc-base64';
import Hex from 'crypto-js/enc-hex';
import Utf8 from 'crypto-js/enc-utf8';

/* Stringify, encrypt and encode data for transmission */
const encryptData = (data, password) => {
  const stringifiedData = JSON.stringify(data);
  const encryptedData = aes.encrypt(stringifiedData, password);
  return encryptedData.toString();
};

/* Decrypt, decode and parse received data */
const decryptData = (data, password) => {
  return aes.decrypt(data, password).toString(Utf8);
};

/* Returns a splice of the hash of the users password */
const makeSubHash = (pass) => sha256(pass).toString().slice(0, 14);

/* Makes the backup */
export const backup = (data, password) => {
  // const subHash = makeSubHash(password);
  const encryptedData = encryptData(data, password);
  console.log(encryptedData);
  console.log(decryptData(encryptedData, password));
};

/* Restores the backup */
export const restore = (backupId, password) => { };
