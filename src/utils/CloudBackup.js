/* eslint-disable */
import sha256 from 'crypto-js/sha256';
import aes from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import axios from 'axios';

const ENDPOINT = 'https://dashy-sync-service.as93.net/';

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
  return axios.post(ENDPOINT, {
    userData: encryptData(data, password),
    subHash: makeSubHash(password),
  });
};

/* Updates and existing backup */
export const update = (data, password, backupId) => {
  return axios.put(ENDPOINT, {
    backupId,
    userData: encryptData(data, password),
    subHash: makeSubHash(password),
  });
};

/* Restores the backup */
export const restore = (backupId, password) => {
  // return axios.get(ENDPOINT, {
  //   backupId,
  //   subHash: makeSubHash(password),
  // });
};
