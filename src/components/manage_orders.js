import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ContractAddress, TIDEABI } from './abi/TideNFTABI';
import {
  getHashFromUrl,
  formatPrice,
  formatSellerExpiryDate,
  getListingsStatus,
  isExpired,
} from './utils';
import { useEffect, useState } from 'react';
import { getPinListByHash } from './pinata';
import axios from 'axios';
import Web3 from 'web3';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function ManageOrders() {
  // const { navigate, state } = useLocation();
  const [filter, setFilter] = useState('');
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const navigate = useNavigate();
  const web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(TIDEABI, ContractAddress);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        let address = await web3.eth.getAccounts();
        address = address[0];
        let transaction = await contract.methods
          .getSoldNFTs()
          .call({ from: address });
        const items = await Promise.all(
          transaction.map(async i => {
            try {
              const tokenURI = await contract.methods
                .tokenURI(i.tokenId)
                .call();
              if (i.state !== 1) {
                return null;
              }
              let meta = await axios.get(tokenURI);
              meta = meta.data;
              const price = formatPrice(i.price);

              const expiryDate = formatSellerExpiryDate(
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
                listingStatus: await getListingsStatus(tokenURI),
                owner: i.owner,
                is_expired: is_expired,
                offer: i.offer,
                image: meta.image,
                name: meta.name,
                description: meta.description,
              };
              console.log(item.listingStatus);
              return item;
            } catch (error) {
              console.error('Error processing NFT:', error);
              return null; // Handle errors appropriately
            }
          }),
        );

        console.log(items);
        updateData(items.filter(item => item !== null)); // Remove null values
        updateFetched(true);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    };

    fetchNFTs();
  }, []);

  function handleClick() {
    navigate('/create_listing');
  }

  const truncateStyle = {
    maxWidth: '250px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  // if (!dataFetched) getNFTData();
  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center mt-6'>
        <div className='sm:flex-auto '>
          <p className='text-2xl font-semibold leading-6 text-gray-900'>
            Manage Orders
          </p>
        </div>
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
        <div className='mt-4 ml-2 sm:mt-0 sm:flex-none'>
          <button
            type='button'
            onClick={handleClick}
            className='block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Create a listing
          </button>
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
                </tr>
              </thead>
              <tbody className='bg-gray-50'>
                {data
                  .filter(rec => rec.name.includes(filter))
                  .map((nft, key) => (
                    <tr
                      key={key}
                      className={`${key === data.length - 1 ? '' : 'border-b'} ${nft.listingStatus.trim() === 'Unlisted' || nft.is_expired || nft.state == 2 ? 'grayscale bg-slate-300' : ''} hover:bg-gray-300`}
                      onClick={() => navigate(`/manage_order/${nft.tokenId}`)}
                    >
                      <th
                        scope='row'
                        className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap cursor-pointer'
                      >
                        {key + 1}
                      </th>
                      <td className='px-6 py-4 max-w-[225px] truncate cursor-pointer'>
                        {nft.name}
                      </td>
                      <td className='px-6 py-4 max-w-[225px] truncate cursor-pointer'>
                        {nft.price} TiDE
                      </td>
                      <td className='px-6 py-4 max-w-[225px] truncate cursor-pointer'>
                        {nft.expiryState === 2
                          ? 'No Expiry'
                          : nft.expiryState === 0
                            ? nft.expiryDays + ' days from purchase'
                            : nft.expiryDate}
                      </td>
                      <td className='px-6 py-4 max-w-[225px] truncate cursor-pointer'>
                        {nft.description}
                      </td>
                      <td className='p-1 max-w-[225px] truncate cursor-pointer'>
                        <img
                          className='h-[60px] w-[60px] flex-none rounded-sm bg-gray-50'
                          src={nft.image}
                          alt=''
                        />
                      </td>
                    </tr>
                  ))}
                {data.filter(rec => rec.name.includes(filter)).length === 0 && (
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
