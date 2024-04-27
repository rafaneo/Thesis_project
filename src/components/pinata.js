import React from 'react';
import { useEffect } from 'react';
// import { Web3 } from 'web3';
// import { create } from '@web3-storage/w3up-client'
// import { StoreMemory } from '@web3-storage/access/stores/store-memory'
import { Buffer } from 'buffer';
import axios from 'axios';

const FormData = require('form-data');

export const uploadJSONToIPFS = async JSONBody => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(
      url,
      { hello: 'world' },
      {
        headers: {
          pinata_api_key: '04339adaf72bd71bb0db',
          pinata_secret_api_key:
            '01a16d3ff7bdcbf72a93a207d6094d4cc2639a2ad43778644aab0b139e085852',
        },
      },
    )
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

export const uploadFileToIPFS = async file => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //making axios POST request to Pinata ⬇️

  let data = new FormData();
  data.append('file', file);

  const metadata = JSON.stringify({
    name: 'testname',
    keyvalues: {
      exampleKey: 'exampleValue',
    },
  });
  data.append('pinataMetadata', metadata);

  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: 'FRA1',
          desiredReplicationCount: 1,
        },
        {
          id: 'NYC1',
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append('pinataOptions', pinataOptions);

  return axios
    .post(url, data, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: '04339adaf72bd71bb0db',
        pinata_secret_api_key:
          '01a16d3ff7bdcbf72a93a207d6094d4cc2639a2ad43778644aab0b139e085852',
      },
    })
    .then(function (response) {
      console.log('image uploaded', response.data.IpfsHash);
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
