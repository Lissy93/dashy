import sha256 from 'crypto-js/sha256';
import aes from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import axios from 'axios';
import { backupEndpoint } from '@/utils/defaults';

const ENDPOINT = backupEndpoint; // 'https://dashy-sync-service.as93.net';

/* Stringify, encrypt and encode data for transmission */
const encryptData = (data, password) => {
  const stringifiedData = JSON.stringify(data);
  const encryptedData = aes.encrypt(stringifiedData, password);
  return encryptedData.toString();
};

/* Decrypt, decode and parse received data */
const decryptData = (data, password) => aes.decrypt(data, password).toString(Utf8);

/* Returns a splice of the hash of the users password */
const makeSubHash = (pass) => sha256(pass).toString().slice(0, 14);

/* Makes the backup */
export const backup = (data, password) => axios.post(ENDPOINT, {
  userData: encryptData(data, password),
  subHash: makeSubHash(password),
});

/* Updates and existing backup */
export const update = (data, password, backupId) => axios.put(ENDPOINT, {
  backupId,
  userData: encryptData(data, password),
  subHash: makeSubHash(password),
});

const encodeGetParams = p => Object.entries(p).map(kv => kv.map(encodeURIComponent).join('=')).join('&');

/* Restores the backup */
export const restore = (backupId, password) => {
  const params = encodeGetParams({ backupId, subHash: makeSubHash(password) });
  const url = `${ENDPOINT}/?${params}`;
  return new Promise((resolve, reject) => {
    axios.get(url).then((response) => {
      if (!response.data || response.data.errorMsg) {
        reject(response.data.errorMsg || 'Error');
      } else {
        const decryptedData = decryptData(response.data.userData.userData, password);
        try { resolve(JSON.parse(decryptedData)); } catch (e) { reject(e); }
      }
    });
  });
};
