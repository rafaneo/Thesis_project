import axios from 'axios';
// import { useState } from 'react';

const FormData = require('form-data');

export const uploadJSONToIPFS = async pinataContent => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  // Construct the JSONBody to match the structure from the official site
  const JSONBody = {
    pinataOptions: {
      cidVersion: 1,
    },
    pinataMetadata: {
      name: 'pinnie.json',
      keyvalues: {
        listingStatus: 'Listed',
      },
    },
    pinataContent: pinataContent,
  };

  return axios
    .post(url, JSONBody, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_MY_PINATA_JWT}`,
        'Content-Type': 'application/json',
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
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const JWT = `Bearer ${process.env.REACT_APP_MY_PINATA_JWT}`;

  const selectedFile = new Blob(file, { type: 'image/png' });

  const formData = new FormData();

  formData.append('file', selectedFile);

  const metadata = JSON.stringify({
    name: file_name,
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', options);

  return axios
    .post(url, formData, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: JWT,
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

export const unlistProduct = async ipfsPinHash => {
  const url = 'https://api.pinata.cloud/pinning/hashMetadata';
  const JSONBody = {
    ipfsPinHash: ipfsPinHash,
    keyvalues: {
      listingStatus: 'Unlisted',
    },
  };

  console.log('Sending request to Pinata with body:', JSONBody);

  return axios
    .put(url, JSONBody, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_MY_PINATA_JWT}`,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      console.log('Response from Pinata:', response.data);
      return {
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.log(
        'Error response from Pinata:',
        error.response ? error.response.data : error.message,
      );
      return {
        success: false,
        message: error.message,
      };
    });
};

export const reListProduct = async ipfsPinHash => {
  const url = 'https://api.pinata.cloud/pinning/hashMetadata';
  const JSONBody = {
    ipfsPinHash: ipfsPinHash,
    keyvalues: {
      listingStatus: 'Listed',
    },
  };

  console.log('Sending request to Pinata with body:', JSONBody);

  return axios
    .put(url, JSONBody, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_MY_PINATA_JWT}`,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      console.log('Response from Pinata:', response.data);
      return {
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.log(
        'Error response from Pinata:',
        error.response ? error.response.data : error.message,
      );
      return {
        success: false,
        message: error.message,
      };
    });
};

export const getPinListByHash = async ipfsPinHash => {
  const url = 'https://api.pinata.cloud/data/pinList';

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_MY_PINATA_JWT}`,
      },
      params: {
        hashContains: ipfsPinHash, // Query parameter to filter by CID
      },
    })
    .then(response => {
      // Extract the keyvalues from the response data
      const pinItems = response.data.rows;
      const keyvalues = pinItems.map(item => item.metadata.keyvalues);

      return {
        success: true,
        keyvalues: keyvalues,
      };
    })
    .catch(error => {
      console.error(
        'Error fetching pinned files:',
        error.response ? error.response.data : error.message,
      );
      return {
        success: false,
        message: error.message,
      };
    });
};

export const setTrackingNumber = async (ipfsPinHash, tracking_number) => {
  const url = 'https://api.pinata.cloud/pinning/hashMetadata';
  const JSONBody = {
    ipfsPinHash: ipfsPinHash,
    keyvalues: {
      trackingNumber: tracking_number,
    },
  };

  console.log('Sending request to Pinata with body:', JSONBody);

  return axios
    .put(url, JSONBody, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_MY_PINATA_JWT}`,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      console.log('Response from Pinata:', response.data);
      return {
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.log(
        'Error response from Pinata:',
        error.response ? error.response.data : error.message,
      );
      return {
        success: false,
        message: error.message,
      };
    });
};

export const RemoveTrackingNumber = async ipfsPinHash => {
  const url = 'https://api.pinata.cloud/pinning/hashMetadata';
  const JSONBody = {
    ipfsPinHash: ipfsPinHash,
    keyvalues: {
      trackingNumber: '',
    },
  };

  console.log('Sending request to Pinata with body:', JSONBody);

  return axios
    .put(url, JSONBody, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_MY_PINATA_JWT}`,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      console.log('Response from Pinata:', response.data);
      return {
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.log(
        'Error response from Pinata:',
        error.response ? error.response.data : error.message,
      );
      return {
        success: false,
        message: error.message,
      };
    });
};
