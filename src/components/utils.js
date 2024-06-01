import web3 from 'web3';
import { ContractAddress, TIDEABI } from './abi/TideNFTABI';
import { getPinListByHash } from './pinata';

export const GetIpfsUrlFromPinata = pinataUrl => {
  var IPFSUrl = pinataUrl.split('/');
  const lastIndex = IPFSUrl.length;
  console.log('lastIndex', lastIndex);
  IPFSUrl = 'https://ipfs.io/ipfs/' + IPFSUrl[lastIndex - 1];
  console.log('IPFSUrl_new', IPFSUrl);
  return IPFSUrl;
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

export const getListingsStatus = async tokenURI => {
  try {
    let hash = getHashFromUrl(tokenURI);
    const query = await getPinListByHash(hash);
    const listingStatus =
      query.keyvalues[0].listingStatus === null
        ? 'Unlisted'
        : query.keyvalues[0].listingStatus;
    return listingStatus.trim(); // Return the value
  } catch (error) {
    console.error('Error getting listing status:', error);
    return 'Unlisted';
  }
};

export const getTrackingNumber = async tokenURI => {
  try {
    let hash = getHashFromUrl(tokenURI);
    const query = await getPinListByHash(hash);
    console.log('query', query);
    const trackingnumber =
      query.keyvalues[0].trackingNumber === null
        ? ''
        : query.keyvalues[0].trackingNumber;
    return trackingnumber.trim(); // Return the value
  } catch (error) {
    console.error('Error getting tracking status:', error);
    return null;
  }
};

export const formatPrice = price => {
  return web3.utils.fromWei(price.toString(), 'ether');
};

export const formatSellerExpiryDate = (
  expiryStatus,
  expiryDays,
  expiryTimeStamp,
) => {
  expiryStatus = parseInt(expiryStatus);
  expiryDays = parseInt(expiryDays);
  expiryTimeStamp = parseInt(expiryTimeStamp);

  if (expiryStatus == 0) {
    return 'Expires ' + expiryDays + ' days after purchase';
  } else if (expiryStatus == 1) {
    const expiry = new Date(expiryTimeStamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return expiry.toLocaleDateString('en-US', options);
  } else {
    return 'No Expiry Date';
  }
};

export const daysToTimestamp = days => {
  const timestamp = new Date();
  timestamp.setDate(timestamp.getDate() + days);
  return parseInt(timestamp.getTime());
};

export const formatBuyerExpiryDate = (
  expiryStatus,
  expiryDays,
  expiryTimeStamp,
) => {
  expiryStatus = parseInt(expiryStatus);
  expiryDays = parseInt(expiryDays);
  expiryTimeStamp = parseInt(expiryTimeStamp);

  if (expiryStatus == 0) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expiryDays);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return expiry.toLocaleDateString('en-US', options);
  } else if (expiryStatus == 1) {
    const expiry = new Date(expiryTimeStamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return expiry.toLocaleDateString('en-US', options);
  } else {
    return 'No Expiry Date';
  }
};

export const isExpired = expiryTimeStamp => {
  expiryTimeStamp = parseInt(expiryTimeStamp);
  const currentTime = new Date().getTime();
  return expiryTimeStamp < currentTime;
};

export const parseData = () => {
  // TODO
};
