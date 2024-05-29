import web3 from 'web3';
import { ContractAddress, TIDEABI } from './abi/TideNFTABI';

export const GetIpfsUrlFromPinata = pinataUrl => {
  var IPFSUrl = pinataUrl.split('/');
  const lastIndex = IPFSUrl.length;
  console.log('lastIndex', lastIndex);
  IPFSUrl = 'https://ipfs.io/ipfs/' + IPFSUrl[lastIndex - 1];
  console.log('IPFSUrl_new', IPFSUrl);
  return IPFSUrl;
};

export const updateExpiry = async id => {
  try {
    let contract = new web3.eth.Contract(TIDEABI, ContractAddress);
    let accounts = await web3.eth.getAccounts();
    let address = accounts[0];
    let transaction = await contract.methods.updateExpiry(id).call();
  } catch (e) {
    // Cannot update expiry because token is not expired
    return false;
  }
};

export const convertGasToTide = gas => {
  let tide = web3.utils.toWei(gas * 10, 'ether');
  return tide;
};

export const getHashFromUrl = url => {
  var IPFSUrl = url.split('/');
  const lastIndex = IPFSUrl.length;
  return IPFSUrl[lastIndex - 1];
};
