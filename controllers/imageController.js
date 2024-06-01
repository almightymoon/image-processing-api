// require("dotenv").config();
// // const fs = require('fs');

// const { createInstance } = require('polotno-node');
// const Request = require('../models/request');


// exports.processImage = async (req, res) => {
//   const requestId = require('crypto').randomBytes(16).toString('hex');
//   const newRequest = await Request.create({ requestId });

//   res.json({ requestId });

//   const instance = await createInstance({
//     key: process.env.API_KEY,
//   });
 
//   const json = req.body;
//   const imageBase64 = await instance.jsonToImageBase64(json);
//   console.log(imageBase64);

//   //   // Prepare CSV data
// //   const csvData = `requestId,imageBase64\n${requestId},${imageBase64}`;  // Header and data row

// //   // Write to CSV file (replace 'output.csv' with your desired filename)
// //   fs.writeFile('output.csv', csvData, (err) => {
// //     if (err) {
// //       console.error('Error writing to CSV file:', err);
// //     } else {
// //       console.log('ImageBase64 data written to output.csv');
// //     }
// //   });

//   await Request.update(
//     { status: 'completed', imageBase64 },
//     { where: { requestId } }
//   );

//   instance.close();
// };

////////////////////////////////////////////////////////////////////////////////////////////////


require("dotenv").config();
const { createInstance } = require('polotno-node');
const Request = require('../models/request');

exports.processImage = async (req, res) => {
  let instance;
  try {
    // Validate the request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Invalid JSON data' });
    }

    const json = req.body;

    // Validate JSON structure, ensuring required fields are present
    if (!json.width || !json.height || !Array.isArray(json.pages) || json.pages.length === 0) {
      return res.status(400).json({ error: 'Missing required fields in JSON data' });
    }

    // Ensure all images in pages have 'src'
    for (const page of json.pages) {
      if (!Array.isArray(page.children)) {
        return res.status(400).json({ error: 'Invalid page structure' });
      }
      for (const child of page.children) {
        if (child.type === 'image' && !child.src) {
          return res.status(400).json({ error: 'Missing src in image' });
        }
      }
    }

    const requestId = require('crypto').randomBytes(16).toString('hex');
    const newRequest = await Request.create({ requestId });

    // Send response early to acknowledge receipt
    res.json({ requestId });

    instance = await createInstance({
      key: process.env.API_KEY,
    });

    const imageBase64 = await instance.jsonToImageBase64(json);
    console.log(imageBase64);

    await Request.update(
      { status: 'completed', imageBase64 },
      { where: { requestId } }
    );

  } catch (error) {
    console.error('Error processing image:', error.message);

    // If headers have not been sent yet, send the error response
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }

  } finally {
    if (instance) {
      instance.close();
    }
  }
};



