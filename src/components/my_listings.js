import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ContractAddress, TIDEABI } from './abi/TideNFTABI';
import { GetIpfsUrlFromPinata } from './utils';
import { useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';

export default function Example() {
  // const { navigate, state } = useLocation();
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const navigate = useNavigate();
  //   const web3 = new Web3(
  //     new Web3.providers.HttpProvider(
  //       'https://eth-sepolia.g.alchemy.com/v2/2bsr75GEPZGZ5I8C7KYtiDpmCDTgQZk4',
  //     ),
  //   );
  const web3 = new Web3(window.ethereum);

  async function getNFTData() {
    let contract = new web3.eth.Contract(TIDEABI, ContractAddress);
    let address = await web3.eth.getAccounts();
    address = address[0];
    console.log(address);
    let transaction = await contract.methods
      .getMyNFTS()
      .call({ from: address });
    const items = await Promise.all(
      transaction.map(async i => {
        const tokenURI = await contract.methods.tokenURI(i.tokenId).call();
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        let price = web3.utils.fromWei(i.price.toString(), 'ether');

        let expiry = parseInt(i.expiry);
        if (expiry != 0) {
          expiry = new Date(parseInt(expiry)).toLocaleString();
        } else {
          expiry = 0;
        }
        let item = {
          price,
          tokenId: parseInt(i.tokenId),
          seller: i.seller,
          expiry: expiry,
          state: i.state,
          owner: i.owner,
          offer: i.offer,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      }),
    );
    updateData(items);
    updateFetched(true);
  }

  function handleClick() {
    navigate('/create_listing');
  }

  //   function fetchNFT(data) {
  //     const newTo = {
  //       pathname: '/nftPage/' + data.data.tokenId,
  //     };

  //     const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);
  //   }

  const truncateStyle = {
    maxWidth: '250px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  if (!dataFetched) getNFTData();
  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center mt-3'>
        <div className='sm:flex-auto mt-4'>
          <p className='text-2xl font-semibold leading-6 text-gray-900'>
            My Listings
          </p>
        </div>
        <div className='mt-4 sm:ml-16 sm:mt-0 sm:flex-none'>
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
          <div className='pb-4 bg-white dark:bg-gray-900 ml-[16%]'>
            <label htmlFor='table-search' className='sr-only'>
              Search
            </label>
            <div className='relative mt-1'>
              <div className='absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none'>
                <svg
                  className='w-4 h-4 text-gray-500 dark:text-gray-400'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 20'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                  />
                </svg>
              </div>
              <input
                type='text'
                id='table-search'
                className='block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Search for items'
              />
            </div>
          </div>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 flex justify-center'>
            <table className='min-w-[70%] divide-y divide-gray-300'>
              <thead>
                <tr>
                  <th className='pl-10 text-center'>{''}</th>
                  <th
                    scope='col'
                    className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'
                  >
                    Listing Name
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    Price
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    Expiry Date
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    Description
                  </th>
                  <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
                    <span className='sr-only'>Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {data.map((nft, key) => (
                  <tr key={nft.tokenId}>
                    <td className='whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-0'>
                      {key + 1}
                    </td>
                    <td
                      style={truncateStyle}
                      className='whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-0'
                    >
                      <div className='flex min-w-0 gap-x-4'>
                        <img
                          className='h-[60px] w-[60px] flex-none rounded-sm bg-gray-50'
                          src={nft.image}
                          alt=''
                        />
                        <p className='text-sm font-semibol mt-4 text-gray-900 '>
                          {nft.name}
                        </p>
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                      {nft.price} TiDE
                    </td>
                    <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                      {nft.expiry === 0 ? 'No Expiry' : nft.expiry}
                    </td>
                    <td
                      aria-hidden='true'
                      style={truncateStyle}
                      className='whitespace-nowrap px-1 py-4 text-sm text-gray-500'
                    >
                      {nft.description}
                    </td>
                    <td className='relative whitespace-nowrap py-4 text-right text-sm font-medium sm:pr-0 inline'>
                      <div className='flex inline'>
                        {parseInt(nft.state) === 1 ? (
                          <span className='bg-red-100 text-red-800 text-xs font-medium me-5 px-4 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300'>
                            Active offer
                          </span>
                        ) : null}
                        <Link
                          to={`/view_listing/${nft.tokenId}`}
                          className='text-indigo-600 hover:text-indigo-900'
                        >
                          <p className='text-indigo-600 hover:text-indigo-900'>
                            View
                          </p>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
