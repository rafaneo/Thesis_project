import { useNavigate } from 'react-router-dom';
import { ContractAddress, TIDEABI } from './abi/TideNFTABI';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';

import { getTrackingNumber, isExpired, formatBuyerExpiryDate } from './utils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function OrderHistory() {
  const [filter, setFilter] = useState('');
  const [data, setData] = useState([]);
  const [wallet, setWallet] = useState('');
  const [dataFetched, setFetched] = useState(false);
  const navigate = useNavigate();

  const web3 = new Web3(window.ethereum);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const contract = new web3.eth.Contract(TIDEABI, ContractAddress);
        let address = await web3.eth.getAccounts();
        address = address[0];

        let transaction = await contract.methods
          .getMyNFTS()
          .call({ from: address });
        const items = await Promise.all(
          transaction.map(async i => {
            try {
              const tokenURI = await contract.methods
                .tokenURI(i.tokenId)
                .call();

              if (i.seller == address && i.owner == address) {
                return null;
              }
              let meta = await axios.get(tokenURI);
              meta = meta.data;
              const price = i.price;

              const expiryDate = formatBuyerExpiryDate(
                i.expiryState,
                i.expiryDays,
                i.expiryTimeStamp,
              );

              let is_expired =
                parseInt(meta.expiryState) === 1 &&
                isExpired(meta.expiryTimeStamp);

              let item = {
                price,
                tokenId: parseInt(i.tokenId),
                seller: i.seller,
                expiryDate: expiryDate,
                state: parseInt(i.state),
                trackingNumber: await getTrackingNumber(tokenURI),
                owner: i.owner,
                is_expired: is_expired,
                offer: i.offer,
                image: meta.image,
                name: meta.name,
                description: meta.description,
              };
              return item;
            } catch (error) {
              console.error('Error processing NFT:', error);
              return null; // Handle errors appropriately
            }
          }),
        );

        transaction = await contract.methods
          .getMyOffers()
          .call({ from: address });
        const offerItems = await Promise.all(
          transaction.map(async i => {
            try {
              const tokenURI = await contract.methods
                .tokenURI(i.tokenId)
                .call();
              const response = await axios.get(tokenURI);
              const meta = response.data;
              const price = web3.utils.fromWei(i.price.toString(), 'ether');
              const expiryDate = formatBuyerExpiryDate(
                i.expiryState,
                i.expiryDays,
                i.expiryTimeStamp,
              );
              let is_expired =
                parseInt(meta.expiryState) === 1 &&
                isExpired(meta.expiryTimeStamp);
              let item = {
                price,
                tokenId: parseInt(i.tokenId),
                seller: i.seller,
                expiryDate: expiryDate,
                state: parseInt(i.state),
                trackingNumber: await getTrackingNumber(tokenURI),
                owner: i.owner,
                is_expired: is_expired,
                offer: i.offer,
                image: meta.image,
                name: meta.name,
                description: meta.description,
              };
              return item;
            } catch (error) {
              console.error('Error processing offer:', error);
              return null;
            }
          }),
        );
        const validItems = offerItems.filter(item => item !== null);

        setData([...items, ...validItems]);
        setWallet(address);
        setFetched(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  async function getNFTOffers() {
    try {
      const contract = new web3.eth.Contract(TIDEABI, ContractAddress);
      let address = await web3.eth.getAccounts();
      address = address[0];
      const transaction = await contract.methods
        .getMyOffers()
        .call({ from: address });

      const items = await Promise.all(
        transaction.map(async i => {
          try {
            const tokenURI = await contract.methods.tokenURI(i.tokenId).call();

            const response = await axios.get(tokenURI);
            const meta = response.data;
            const price = web3.utils.fromWei(i.price.toString(), 'ether');

            const expiryDate = formatBuyerExpiryDate(
              i.expiryState,
              i.expiryDays,
              i.expiryTimeStamp,
            );
            console.log('meta:', expiryDate);
            let is_expired =
              parseInt(meta.expiryState) === 1 &&
              isExpired(meta.expiryTimeStamp);

            console.log(transaction);
            let item = {
              price,
              tokenId: parseInt(i.tokenId),
              seller: i.seller,
              expiryDate: expiryDate,
              state: parseInt(i.state),
              trackingNumber: await getTrackingNumber(tokenURI),
              owner: i.owner,
              is_expired: is_expired,
              offer: i.offer,
              image: meta.image,
              name: meta.name,
              description: meta.description,
            };
            return item;
          } catch (error) {
            console.error('Error processing offer:', error);
            return null;
          }
        }),
      );

      const validItems = items.filter(item => item !== null);
      setData(validItems);
      setFetched(true);
      return validItems;
    } catch (error) {
      console.error('Error retrieving NFT offers:', error);
      return [];
    }
  }

  const truncateStyle = {
    maxWidth: '250px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center sm:justify-between mt-6'>
        <p className='text-2xl font-semibold leading-6 text-gray-900'>
          Order History
        </p>
        <div className='flex items-center max-w-xs sm:max-w-md w-full'>
          <label htmlFor='simple-search' className='sr-only'>
            Search
          </label>
          <div className='relative w-full inline-flex'>
            <MagnifyingGlassIcon
              className='absolute left-1 top-2 h-3 w-3 sm:h-6 sm:w-6'
              aria-hidden='true'
            />
            <input
              type='text'
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className='bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-7 p-2 '
              placeholder='Search items...'
              required
            />
          </div>
        </div>
      </div>
      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto relative sm:-mx-6 lg:-mx-8'>
          <div className='relative overflow-x-auto min-w-full py-2 align-middle sm:px-6 lg:px-8 flex justify-center'>
            <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-200'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    #
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Order Name
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Price
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Expiry Date
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Description
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Image
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Status
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Tracking Number
                  </th>
                </tr>
              </thead>
              <tbody className='bg-gray-50'>
                {data
                  .filter(
                    rec =>
                      rec != null && rec.name.toLowerCase().includes(filter),
                  )
                  .map((nft, key) => (
                    <tr
                      key={key}
                      className={`${key === data.length - 1 ? '' : 'border-b'} ${nft.is_expired ? 'grayscale bg-slate-300' : ''} hover:bg-gray-300`}
                      onClick={() => navigate(`/product/${nft.tokenId}`)}
                    >
                      <th
                        scope='row'
                        className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'
                      >
                        {key + 1}
                      </th>
                      <td className='px-6 py-4 max-w-[225px] truncate'>
                        {nft.name}
                      </td>
                      <td className='px-6 py-4 max-w-[225px] truncate'>
                        {nft.price} TiDE
                      </td>
                      <td className='px-6 py-4 max-w-[225px] truncate'>
                        {nft.is_expired ? 'EXPIRED' : nft.expiryDate}
                      </td>
                      <td className='px-6 py-4 max-w-[225px] truncate'>
                        {nft.description}
                      </td>
                      <td className='p-1 max-w-[225px] truncate'>
                        <img
                          className='h-[60px] w-[60px] flex-none rounded-sm bg-gray-50'
                          src={nft.image}
                          alt=''
                        />
                      </td>
                      <td className='px-6 py-4 max-w-[225px] truncate'>
                        {getState(nft.state)}
                      </td>
                      <td className='px-6 py-4 max-w-[225px] truncate'>
                        {nft.trackingNumber}
                      </td>
                    </tr>
                  ))}
                {data.filter(rec => rec !== null && rec.name.includes(filter))
                  .length === 0 && (
                  <td className='px-6 py-4' colSpan={7}>
                    No records found...
                  </td>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const getState = state => {
  switch (state) {
    case 0:
      return 'Listed';
    case 1:
      return 'Pending';
    case 2:
      return 'Accepted';
    case 3:
      return 'Expired';
    case 4:
      return 'Unlisted';
    default:
      return 'Invalid';
  }
};
