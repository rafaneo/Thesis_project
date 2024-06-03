import Web3 from 'web3';
import { ContractAddress, TIDEABI } from './abi/TideNFTABI';
import { getPinListByHash } from './pinata';
import axios from 'axios';
import { EthreumNull } from './abi/TideNFTABI';
import { useNavigate } from 'react-router-dom';
const web3 = new Web3(window.ethereum);
let contract = new web3.eth.Contract(TIDEABI, ContractAddress);

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

    if (
      query &&
      query.keyvalues &&
      query.keyvalues.length > 0 &&
      query.keyvalues[0].trackingNumber !== null &&
      query.keyvalues[0].trackingNumber !== undefined
    ) {
      return query.keyvalues[0].trackingNumber.trim();
    } else {
      return 'N/A';
    }
  } catch (error) {
    console.error('Error getting tracking status:', error);
    return null; // Return null if an error occurs
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

  if (expiryStatus === 0) {
    return 'Expires ' + expiryDays + ' days after purchase';
  } else if (expiryStatus === 1) {
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
  } else if (expiryStatus === 1) {
    const expiry = new Date();
    expiry.setTime(expiryTimeStamp);
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

export const fetchNFTs = async () => {
  try {
    let address = await web3.eth.getAccounts();
    address = address[0];
    let transaction = await contract.methods
      .getAllNFTs()
      .call({ from: address });
    const items = await Promise.all(
      transaction.map(async i => {
        try {
          const tokenURI = await contract.methods.tokenURI(i.tokenId).call();

          let meta = await axios.get(tokenURI);
          meta = meta.data;

          let listingStatus = await getListingsStatus(tokenURI);

          if (parseInt(i.expiryState) === 1) {
            let isExpired = isExpired(i.expiryTimeStamp);
            if (isExpired) {
              return null;
            }
          }

          if (listingStatus === 'Unlisted') {
            return null;
          }

          if (
            [1, 2, 3, 4].includes(parseInt(i.state)) ||
            i.offer !== EthreumNull
          ) {
            return null;
          }
          const price = formatPrice(i.price);

          const expiryDate = formatSellerExpiryDate(
            i.expiryState,
            i.expiryDays,
            i.expiryTimeStamp,
          );

          let item = {
            price,
            tokenId: parseInt(i.tokenId),
            seller: i.seller,
            expiryDate: expiryDate,
            state: parseInt(i.state),
            listingStatus: listingStatus,
            owner: i.owner,
            offer: i.offer,
            image: meta.image,
            name: meta.name,
            description: meta.description,
            category: meta.attributes.selectedOption.option_parent,
          };

          return item;
        } catch (error) {
          console.error('Error processing NFT:', error);
          return null; // Handle errors appropriately
        }
      }),
    );
    return items.filter(item => item !== null); // Filter out null items
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return []; // Return an empty array in case of error
  }
};

export const accessProductRestrictions = (state, navigate) => {
  if (state === 0) {
    return 1;
  } else if (state === 1) {
    navigate('/*');
  } else {
    navigate('/*');
  }
};
