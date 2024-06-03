import { ContractAddress, TIDEABI, EthreumNull } from './abi/TideNFTABI';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatSellerExpiryDate, fetchNFTs } from './utils';
import axios from 'axios';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import Web3 from 'web3';

export default function ListingView(props) {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [recomendedData, updateRecomendedData] = useState([]);
  const [userAccount, setUserAccount] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dataFetched, updateFetched] = useState(false);
  const navigate = useNavigate();

  const provider = `https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_MY_ALCHEMY_API_KEY}`;
  const web3 = new Web3(new Web3.providers.HttpProvider(provider));
  let contract = new web3.eth.Contract(TIDEABI, ContractAddress);

  // useEffect(() => {
  //   const fetchAndSetRecommendedData = async () => {
  //     try {
  //       const fetchedData = await fetchNFTs();
  //       const randomIndexes = [];
  //       const selectedItems = [];

  //       // Generate 3 unique random indexes
  //       while (randomIndexes.length < 3) {
  //         const randomIndex = Math.floor(Math.random() * fetchedData.length);
  //         if (!randomIndexes.includes(randomIndex)) {
  //           randomIndexes.push(randomIndex);
  //         }
  //       }

  //       // Select items at random indexes
  //       randomIndexes.forEach(index => {
  //         selectedItems.push(fetchedData[index]);
  //       });

  //       updateRecomendedData(selectedItems);
  //     } catch (error) {
  //       console.error('Error fetching and setting recommended NFTs:', error);
  //     }
  //   };
  //   fetchAndSetRecommendedData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let accounts = await web3.eth.getAccounts();
        let address = accounts[0];
        if (address) {
          setIsLoggedIn(true);
        }
        setUserAccount(address);
        let transaction = await contract.methods
          .getTokenData(id)
          .call({ from: address });
        // accessProductRestrictions(transaction.state, navigate);
        const tokenURI = await contract.methods.tokenURI(id).call();

        let meta = await axios.get(tokenURI);
        meta = meta.data;
        const price = meta.price;

        const expiryDate = formatSellerExpiryDate(
          transaction.expiryState,
          transaction.expiryDays,
          transaction.expiryTimeStamp,
        );
        console.log('meta:', transaction.expiryDays);
        var data = {
          price,
          tokenId: parseInt(transaction.tokenId),
          seller: transaction.seller,
          expiryDate: expiryDate,
          expiryDays: parseInt(meta.attributes.expiry),
          expiryTimestamp: transaction.expiryTimeStamp,
          state: transaction.state,
          owner: transaction.owner,
          offer: transaction.offer,
          image: meta.image,
          name: meta.name,
          description: meta.description,
          selectedOptions: meta.attributes.selectedOption.option_parent,
          storename: '',
        };

        try {
          const response = await axios.get(
            'http://16.16.19.83:8000/api/getAccountDetails',
            {
              headers: {
                'Wallet-Address': data.seller,
              },
            },
          );
          if (response.status === 200) {
            const { storename } = response.data;
            data.storename = storename;
          } else {
            console.log(
              'Failed to get account details:',
              response.data.message,
            );
          }
        } catch (error) {
          if (error.response) {
            console.error('Error response:', error.response.data);
          } else if (error.request) {
            console.error('Error request:', error.request);
          } else {
            console.error('Error message:', error.message);
          }
        }
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
                    disabled={isOwner || hasOffer || !isLoggedIn}
                    className={
                      'flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-500'
                    }
                  >
                    {!isLoggedIn && 'Login to purchase'}
                    {isOwner && 'You own this product'}
                    {hasOffer && 'Offer pending'}
                    {!(isOwner || hasOffer) && isLoggedIn && 'Purchase Product'}
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
                    dangerouslySetInnerHTML={{
                      __html: data.storename ? data.storename : data.seller,
                    }}
                  />
                </div>

                <div className='mt-10'>
                  <h2 className='text-sm font-medium text-gray-900'>Expiry</h2>

                  <p className='prose prose-sm text-gray-500'>
                    <span className='inline'>{data.expiryDate}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <Carousel
            className='mt-10'
            autoPlay={false}
            style={{ height: '2500px' }}
          >
            {recomendedData.map(item => (
              <Link
                to={`/product/${item.tokenId}`}
                className='mt-2 text-indigo-600 underline border'
                style={{ textDecoration: 'none' }}
              >
                <Paper key={item.tokenId} style={{ height: '100%' }}>
                  <div className='flex flex-col items-center h-full'>
                    <img
                      src={item.image}
                      className='rounded-lg'
                      alt={item.name}
                      style={{
                        maxHeight: '150px',
                        maxWidth: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <p className='text-lg font-medium mt-2'>{item.name}</p>
                    <p className='text-lg font-medium'>{item.price} TiDE</p>
                  </div>
                </Paper>
              </Link>
            ))}
          </Carousel> */}
        </div>
      </div>
    );
  }
}
