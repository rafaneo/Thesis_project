import React from 'react';
import { useEffect, useState } from 'react';
import { Web3 } from 'web3';
// import { create } from '@web3-storage/w3up-client'
// import { StoreMemory } from '@web3-storage/access/stores/store-memory'
import { Buffer } from 'buffer';
import axios from 'axios'

const FormData = require('form-data');


export default function Web3_Storage() {
	
    async function uploadJSONToIPFS(JSONBody) {

            const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
            //making axios POST request to Pinata ⬇️
            return axios 
                .post(url, { hello: 'world' }, {
                    headers: {
                        pinata_api_key: "04339adaf72bd71bb0db",
                        pinata_secret_api_key: "01a16d3ff7bdcbf72a93a207d6094d4cc2639a2ad43778644aab0b139e085852",
                    }
                })
                .then(function (response) {
                   return {
                       success: true,
                       pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
                   };
                })
                .catch(function (error) {
                    console.log(error)
                    return {
                        success: false,
                        message: error.message,
                    }
        
            });
        };


    useEffect(() => {
        const res = uploadJSONToIPFS(makeFileObjects());
        console.log(res);
        
    }, []);

    function makeFileObjects () {
        const obj = { hello: 'world' }
        const buffer = Buffer.from(JSON.stringify(obj))
        const files = [
          new File(['contents-of-file-1'], 'plain-utf8.txt'),
          new File([buffer], 'hello.json')
        ]
        return files
    }

	return (
        <></>
	);
}