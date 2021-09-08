'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */
const fs = require("fs");
const client = require('http');
const tmp = require('tmp');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
      client.get(url, (res) => {
          if (res.statusCode === 200) {
              res.pipe(fs.createWriteStream(filepath))
                  .on('error', reject)
                  .once('close', () => resolve(filepath));
          } else {
              // Consume response data to free up memory
              res.resume();
              reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

          }
      });
  });
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
      client.get(url, (res) => {
        const data = [];
          if (res.statusCode === 200) {
            res.on('data', chunk => {
              data.push(chunk);
            });
            res.on('end', () => {
              const resString = Buffer.concat(data).toString();
              resolve(resString);
            });
          } else {
              // Consume response data to free up memory
              res.resume();
              reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

          }
      });
  });
}

module.exports = {
  /**
   * Obtenedor de imágenes, una a la hora durante las horas de luz
   */
  '40 0,1,2,3,4,5,6,7,8,9,19,20,21,22,23 * * *': async () => {
    console.log(`${new Date().toISOString()} sacando imagen`);
    const fileurl = "http://growpi/foto.php";
    tmp.file({postfix: '.jpg'}, async function _tempFileCreated(err, path, fd, cleanupCallback) {
      if (err) throw err;
      const filepath = path;
      
      await downloadImage(fileurl, filepath);

      const fileStat = fs.statSync(filepath);
      const attachment = await strapi.plugins.upload.services.upload.upload({
        data: {},
        files: {
          path: filepath,
          name: `foto${new Date().toISOString()}.jpg`,
          type: 'image/jpg', // mime type
          size: fileStat.size,
        },
      });
      await strapi.query('Fotos').create(
        {
          foto: attachment
        }
      );
      console.log(`${new Date().toISOString()} sacada imagen`);
      // If we don't need the file anymore we could manually call the cleanupCallback
      // But that is not necessary if we didn't pass the keep option because the library
      // will clean after itself.
      cleanupCallback();
    });
    

  },
  /* cada 10 mins */
  '*/10 * * * *': async () => {
    console.log(`${new Date().toISOString()} temperatura y humedad`);
    const data = await makeRequest("http://growpi/temphum.php");
    console.log(data);
    const [temperatura, humedad] = data.split(' ').map(el => parseFloat(el.replace(/[TH]=/gi, ''))); 

    console.log(temperatura, humedad);
    await strapi.query('Clima').create(
      {
        temperatura,
        humedad
      }
    );
    console.log(`${new Date().toISOString()} sacada temperatura y humedad`);
  }
};
