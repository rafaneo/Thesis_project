import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ContractAddress, TIDEABI } from './abi/TideNFTABI';
import { GetIpfsUrlFromPinata } from './utils';
import { useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import { set } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function OrderHistory() {
  // const { navigate, state } = useLocation();
  const [filter, setFilter] = useState('');
  const [data, updateData] = useState([]);
  const [dataOffers, updateDataOffers] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [wallet, setWallet] = useState('');
  const navigate = useNavigate();

  const web3 = new Web3(window.ethereum);

  async function getNFTData() {
    let contract = new web3.eth.Contract(TIDEABI, ContractAddress);
    let address = await web3.eth.getAccounts();
    address = address[0];
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
          state: parseInt(i.state),
          owner: i.owner,
          offer: i.offer,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };

        return item;
      }),
    );
    setWallet(address);
    updateData(items);
    updateFetched(true);
  }

  async function getNFTOffers() {
    try {
      const contract = new web3.eth.Contract(TIDEABI, ContractAddress);
      const address = (await web3.eth.getAccounts())[0];
      const transaction = await contract.methods
        .getMyOffers()
        .call({ from: address });

      const items = await Promise.all(
        transaction.map(async offer => {
          try {
            const tokenURI = await contract.methods
              .tokenURI(offer.tokenId)
              .call();

            const response = await axios.get(tokenURI);
            const meta = response.data;
            const price = web3.utils.fromWei(offer.price.toString(), 'ether');

            let expiry = parseInt(offer.expiry);
            expiry = expiry !== 0 ? new Date(expiry).toLocaleString() : 0;

            const item = {
              price,
              tokenId: parseInt(offer.tokenId),
              seller: offer.seller,
              expiry,
              state: parseInt(offer.state),
              owner: offer.owner,
              offer: offer.offer,
              image: meta.image,
              name: meta.name,
              description: meta.description,
            };

            console.log(item.offer);

            return item;
          } catch (error) {
            console.error('Error processing offer:', error);
            return null;
          }
        }),
      );

      const validItems = items.filter(item => item !== null);
      updateDataOffers(validItems);
      updateFetched(true);
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

  if (!dataFetched) {
    getNFTData();
    getNFTOffers();
  }
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
                </tr>
              </thead>
              <tbody className='bg-gray-50'>
                {dataOffers
                  .filter(rec => rec.name.includes(filter))
                  .map((nft, key) => (
                    <tr
                      key={key}
                      className={key === data.length - 1 ? '' : ' border-b'}
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
                        {nft.expiry === 0 ? 'No Expiry' : nft.expiry}
                      </td>
                      <td className='px-6 py-4 max-w-[225px] truncate'>
                        {nft.description}
                      </td>
                      <td className='p-1 max-w-[225px] truncate'>
                        <img
                          className='h-[60px] w-[60px] flex-none rounded-sm bg-gray-50 grayscale-[80%]'
                          src={nft.image}
                          alt=''
                        />
                      </td>
                      <td className='px-6 py-4 max-w-[225px] truncate'>
                        {getState(nft.state)}
                      </td>
                    </tr>
                  ))}
                {dataOffers.filter(rec => rec.name.includes(filter)).length ===
                  0 && (
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
