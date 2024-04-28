import axios from 'axios';
import { useState } from 'react';

const FormData = require('form-data');

export const uploadJSONToIPFS = async JSONBody => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: `${process.env.REACT_APP_MY_PINATA_API_KEY}`,
        pinata_secret_api_key:
          `${process.env.REACT_APP_MY_PINATA_SECRET_API_KEY}`,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataURL:
          'https://gateway.pinata.cloud/ipfs/' + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const uploadFileToIPFS = async (file, file_name) => {
  const JWT = `Bearer ${process.env.REACT_APP_MY_PINATA_JWT}`;

  const selectedFile = new Blob(file, { type: 'image/png' });


  const formData = new FormData();
  
  formData.append('file', selectedFile)

  const metadata = JSON.stringify({
    name: file_name,
  });
  formData.append('pinataMetadata', metadata);
  
  const options = JSON.stringify({
    cidVersion: 0,
  })
  formData.append('pinataOptions', options);

  try{
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: JWT
      }
    });
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};