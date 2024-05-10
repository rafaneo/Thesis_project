import { ContractAddress, TIDEABI } from './abi/TideNFTABI';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';

export default function ViewTokenData(props) {
  const { id } = useParams();
  const [tokenData, setTokenData] = useState({}); // Renamed state variable

  const [tokenNum, setTokenNum] = useState(1);
  const web3 = new Web3(window.ethereum);

  function handleChange(event) {
    setTokenNum(event.target.value);
  }

  async function fetchData() {
    try {
      let contract = new web3.eth.Contract(TIDEABI, ContractAddress);
      let accounts = await web3.eth.getAccounts();
      let address = accounts[0];
      let transaction = await contract.methods
        .getTokenData(tokenNum)
        .call({ from: address });
      console.log(transaction);
      const tokenURI = await contract.methods.tokenURI(tokenNum).call();

      let meta = await axios.get(tokenURI);

      let price = web3.utils.fromWei(transaction.price.toString(), 'ether');

      var expiry = parseInt(transaction.expiry);
      if (expiry !== 0) {
        expiry = new Date(parseInt(expiry)).toLocaleString();
      } else {
        expiry = 0;
      }
      var tokenData = {
        // Renamed variable
        price,
        tokenId: parseInt(transaction.tokenId),
        seller: transaction.seller,
        expiryDays: parseInt(meta.data.attributes.expiry),
        orderNumber: transaction.orderNumber,
        expiryTimestamp: expiry,
        state: transaction.state,
        owner: transaction.owner,
        offer: transaction.offer,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        selectedOptions: meta.data.selectedOptions,
      };

      setTokenData(tokenData); // Updated to use setTokenData
    } catch (error) {
      console.error('Error fetching NFT:', error);
    }
  }
  async function updateOrderNumber() {
    try {
      let contract = new web3.eth.Contract(TIDEABI, ContractAddress);
      let accounts = await web3.eth.getAccounts();
      let address = accounts[0];
      let gas = await contract.methods
        .updateOrderNumber(tokenNum, '')
        .estimateGas({ from: address });

      let transaction = await contract.methods
        .updateOrderNumber(tokenNum, '')
        .send({ from: address, gas: gas })
        .on('receipt', function (receipt) {
          if (receipt.events.DebugInfo) {
            receipt.events.DebugInfo.forEach(event => {
              console.log(event.returnValues);
            });
          }
        })
        .on('error', function (error) {
          console.error(error);
        });

      console.log('clicked');
      console.log(transaction);
    } catch (error) {
      console.error('Error fetching NFT:', error);
    }
  }
  return (
    <div className='bg-gray'>
      <button className='border-2 mr-10' onClick={updateOrderNumber}>
        Click to update Order Number
      </button>
      <button className='border-2 mr-10' onClick={fetchData}>
        Click to fetch
      </button>
      <input
        className='border-2'
        type='text'
        value={tokenNum}
        onChange={handleChange}
      />
      <div className='mt-4'>
        <h2 className='mb-5'>Token Data below</h2>
        <p>Name: {tokenData.name}</p>
        <p>Description: {tokenData.description}</p>
        <p>Price: {tokenData.price}</p>
        <p>Expiry: {tokenData.expiryDays}</p>
        <p>TimeStamp: {tokenData.expiryTimestamp}</p>
        <p>
          State:{' '}
          {tokenData.state === 0 ? (
            <span>Listed</span>
          ) : tokenData.state === 1 ? (
            <span>Offer</span>
          ) : tokenData.state === 2 ? (
            <span>Completed</span>
          ) : tokenData.state === 3 ? (
            <span>Expired</span>
          ) : null}
        </p>{' '}
        <p>Owner: {tokenData.owner}</p>
        <p>Offer: {tokenData.offer}</p>
        <p>Image: {tokenData.image}</p>
        <p>Selected Options: {tokenData.selectedOptions}</p>
        <p>Order Number: {tokenData.orderNumber}</p>
      </div>
    </div>
  );
}
