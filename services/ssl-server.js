const fs = require('fs');
const util = require('util');
const https = require('https');

const promise = util.promisify;
const stat = promise(fs.stat);

module.exports = (app) => {
  const httpsCerts = {
    private: process.env.SSL_PRIV_KEY_PATH || '/etc/ssl/certs/dashy-priv.key',
    public: process.env.SSL_PUB_KEY_PATH || '/etc/ssl/certs/dashy-pub.pem',
  };

  const isDocker = !!process.env.IS_DOCKER;
  const SSLPort = process.env.SSL_PORT || (isDocker ? 443 : 4001);

  const printSuccess = () => {
    console.log(`🔐 HTTPS server successfully started (port: ${SSLPort} ${isDocker ? 'of container' : ''})`);
  };

  const printNotSoGood = (msg) => {
    console.log(`SSL Not Enabled: ${msg}`);
  };

  /* Starts SSL-secured node server */
  const startSSLServer = () => {
    const httpsServer = https.createServer({
      key: fs.readFileSync(httpsCerts.private),
      cert: fs.readFileSync(httpsCerts.public),
    }, app);
    httpsServer.listen(SSLPort, () => { printSuccess(); });
  };

  /* Check if SSL certs present, if so also start the HTTPS server */
  stat(httpsCerts.public).then(() => {
    stat(httpsCerts.private).then(() => {
      startSSLServer();
    }).catch(() => { printNotSoGood('Private key not present'); });
  }).catch(() => { printNotSoGood('Public key not present'); });
};
