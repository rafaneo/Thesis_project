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
          selectedOptions: meta.data.selectedOptions,
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

  if (dataFetched === false) {
    // setTimeout(() => {
    //   if (dataFetched === false) {
    //     navigate('/*');
    //   }
    // }, 5000);
    return <p className='text-center mt-10'>Loading...</p>;
  } else if ((dataFetched === true && data.state === 3) || data.state === 1) {
    navigate('/*');
  } else {
    return (
      <div className='bg-white'>
        <div className='pb-16 pt-6 sm:pb-24 border-b-4'>
          <nav
            aria-label='Breadcrumb'
            className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
          >
            <ol className='flex items-center space-x-4'>
              <li className='text-sm'>
                <p
                  // href={data.image}
                  aria-current='page'
                  className='text-lg font-medium text-back hover:text-gray-600'
                >
                  {data.name}
                </p>
              </li>
            </ol>
          </nav>
          <div className='mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 border p-5'>
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
                {/* Reviews */}
              </div>

              <div className='grid grid-cols-2 mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0'>
                <div>
                  <img
                    src={data.image}
                    className='rounded-lg w-auto h-auto object-center object-cover'
                  />
                </div>

                <div className='m-auto ml-7'>
                  <h2 className='text-sm text-gray-500 mb-10'>
                    Owner:{' '}
                    <a
                      href={`https://etherscan.io/address/${data.owner}`}
                      className='inline hover:text-indigo-600 underline'
                    >
                      {data.owner}
                    </a>
                  </h2>
                  <h2 className='text-sm text-gray-500 mb-10'>
                    Seller:{' '}
                    <a
                      href={`https://etherscan.io/address/${data.seller}`}
                      className='inline hover:text-indigo-600 underline'
                    >
                      {data.seller}
                    </a>
                  </h2>
                  <h2 className='text-sm text-gray-500 mb-10'>
                    Expiry:{' '}
                    <p className='text-gray-800 inline'>
                      {data.expiryTimestamp === 0 ? (
                        <p className='inline'>No expiry</p>
                      ) : (
                        <span className='inline'>
                          {data.expiryDays}-days {data.expiryTimestamp}
                        </span>
                      )}
                    </p>
                  </h2>
                </div>
              </div>
              <div className='lg:col-span-5'>
                {data.seller === userAccount ? (
                  <button
                    className='flex w-full mt-5 items-center justify-center rounded-md border border-transparent bg-gray-400 px-8 py-3 text-base font-medium text-white focus:outline-none'
                    disabled
                  >
                    You are the owner of this product
                  </button>
                ) : data.offer !== EthreumNull ? (
                  <button
                    className='flex w-full mt-5 items-center justify-center rounded-md border border-transparent bg-gray-400 px-8 py-3 text-base font-medium text-white focus:outline-none'
                    disabled
                  >
                    This product already has an offer
                  </button>
                ) : (
                  <Link to={`/product/${data.tokenId}/purchase`}>
                    <button className='flex w-full mt-5 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                      Purchase Product
                    </button>
                  </Link>
                )}
                <div className='mt-10'>
                  <h2 className='text-sm font-medium text-gray-900'>
                    Description
                  </h2>

                  <div
                    className='prose prose-sm mt-4 text-gray-500 break-words'
                    dangerouslySetInnerHTML={{
                      __html: data.description,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
