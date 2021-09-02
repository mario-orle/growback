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
   * Obtenedor de imágenes
   */
  '* * * * *': async () => {
    console.log("sacando imagen");
    const tmpobj = tmp.fileSync({postfix: '.jpg'});
    const filepath = tmpobj.name;
    const fileurl = "http://192.168.0.19/foto.php";
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
    console.log("sacada imagen");
  },
  '* * * * *': async () => {
    console.log("sacando temperatura y humedad");
    const data = await makeRequest("http://192.168.0.19/temphum.php");
    console.log(data);
    const [temperatura, humedad] = data.split(' ').map(el => parseFloat(el.replace(/[TH]=/gi, ''))); 

    console.log(temperatura, humedad);
    await strapi.query('Clima').create(
      {
        temperatura,
        humedad
      }
    );
    console.log("sacada temperatura y humedad");
  }
};
