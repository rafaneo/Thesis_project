import { ContractAddress, TIDEABI, EthreumNull } from './abi/TideNFTABI';
import { StarIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import products from './data';
import axios from 'axios';
import Web3 from 'web3';

export default function ListingView(props) {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [userAccount, setUserAccount] = useState('');
  const [dataFetched, updateFetched] = useState(false);
  const navigate = useNavigate();
  const web3 = new Web3(window.ethereum);

  // TODO Ability to change listing.

  async function TokenExpired(id) {
    let contract = new web3.eth.Contract(TIDEABI, ContractAddress);
    let address = await web3.eth.getAccounts();
    address = address[0];
    try {
      let transaction = await contract.methods
        .updateExpiry(id)
        .call({ from: address });
      return true;
    } catch (e) {
      return false;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let contract = new web3.eth.Contract(TIDEABI, ContractAddress);
        let accounts = await web3.eth.getAccounts();
        let address = accounts[0];
        setUserAccount(address);
        let transaction = await contract.methods
          .getTokenData(id)
          .call({ from: address });

        const tokenURI = await contract.methods.tokenURI(id).call();

        let meta = await axios.get(tokenURI);

        let price = web3.utils.fromWei(transaction.price.toString(), 'ether');

        var expiry = parseInt(transaction.expiry);
        if (expiry != 0) {
          expiry = new Date(parseInt(expiry)).toLocaleString();
        } else {
          expiry = 0;
        }
        var data = {
          price,
          tokenId: parseInt(transaction.tokenId),
          seller: transaction.seller,
          expiryDays: parseInt(meta.data.attributes.expiry),
          expiryTimestamp: expiry,
          state: transaction.state,
          owner: transaction.owner,
          offer: transaction.offer,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          selectedOptions: meta.data.attributes.selectedOption.option_parent,
        };
        setData(data);
        updateFetched(true);
      } catch (error) {
        console.error('Error fetching NFT:', error);
        // Handle error here
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, [id]);

  const isOwner = data.seller === userAccount;
  const hasOffer = data.offer !== EthreumNull;

  if (dataFetched === false) {
    return <p className='text-center mt-10'>Loading...</p>;
  } else if ((dataFetched === true && data.state === 3) || data.state === 1) {
    navigate('/*');
  } else {
    return (
      <div className='bg-white'>
        <div className='pb-16 pt-6 sm:pb-24'>
          <nav
            aria-label='Breadcrumb'
            className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
          >
            <ol role='list' className='flex items-center space-x-4'>
              <li>
                <div className='flex items-center'>
                  <p className='mr-4 text-sm font-medium text-gray-900 capitalize'>
                    {data.selectedOptions}
                  </p>
                  <svg
                    viewBox='0 0 6 20'
                    aria-hidden='true'
                    className='h-5 w-auto text-gray-300'
                  >
                    <path
                      d='M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z'
                      fill='currentColor'
                    />
                  </svg>
                </div>
              </li>
              <li className='text-sm'>
                <p className='font-medium text-gray-500 hover:text-gray-600'>
                  {data.name}
                </p>
              </li>
            </ol>
          </nav>
          <div className='mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
            <div className='lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8'>
              <div className='lg:col-span-5 lg:col-start-8'>
                <div className='flex justify-between'>
                  <h1 className='text-xl font-medium text-gray-900'>
                    {data.name}
                  </h1>
                  <p className='text-xl font-medium text-gray-900'>
                    {data.price} TiDE
                  </p>
                </div>
              </div>

              {/* Image gallery */}
              <div className='mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0'>
                <h2 className='sr-only'>Images</h2>

                <div className='grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8'>
                  <img
                    src={data.image}
                    className='lg:col-span-2 lg:row-span-2 rounded-lg'
                  />
                </div>
              </div>

              <div className='mt-4 lg:col-span-5 space-y-4'>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    navigate(`/product/${data.tokenId}/purchase`);
                  }}
                >
                  <button
                    type='submit'
                    disabled={isOwner || hasOffer}
                    className={
                      'flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-500'
                    }
                  >
                    {isOwner && 'You own this product'}
                    {hasOffer && 'Offer pending'}
                    {!(isOwner || hasOffer) && 'Purchase Product'}
                  </button>
                </form>

                {/* Product details */}
                <div className='mt-10'>
                  <h2 className='text-sm font-medium text-gray-900'>
                    Description
                  </h2>

                  <div
                    className='prose prose-sm mt-4 text-gray-500'
                    dangerouslySetInnerHTML={{ __html: data.description }}
                  />
                </div>

                <div className='mt-10 border-t border-gray-200 pt-8'>
                  <h2 className='text-sm font-medium text-gray-900'>Owner</h2>

                  <a
                    href={`https://etherscan.io/address/${data.owner}`}
                    className='prose prose-sm mt-4 text-gray-500 hover:text-indigo-600 underline'
                    dangerouslySetInnerHTML={{ __html: data.owner }}
                  />
                </div>

                <div className='mt-10'>
                  <h2 className='text-sm font-medium text-gray-900'>Seller</h2>

                  <a
                    href={`https://etherscan.io/address/${data.seller}`}
                    className='prose prose-sm mt-4 text-gray-500 hover:text-indigo-600 underline'
                    dangerouslySetInnerHTML={{ __html: data.seller }}
                  />
                </div>

                <div className='mt-10'>
                  <h2 className='text-sm font-medium text-gray-900'>Expiry</h2>

                  <p className='prose prose-sm text-gray-500'>
                    {data.expiryTimestamp === 0 ? (
                      <p className='inline'>No expiry</p>
                    ) : (
                      <span className='inline'>
                        {data.expiryDays}-days {data.expiryTimestamp}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
