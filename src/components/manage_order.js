import { ContractAddress, TIDEABI, EthreumNull } from './abi/TideNFTABI';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { setTrackingNumber } from './pinata';
import {
  getListingsStatus,
  formatSellerExpiryDate,
  isExpired,
  getHashFromUrl,
} from './utils';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
const schema = yup
  .object({
    tracking_number: yup
      .string()
      .max(25, 'Tracking number must not exceed 50 characters...')
      .required('Tracking number is required!'),
  })
  .required();

export default function ManageOrder(props) {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [personInfo, setPersonInfo] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [wallet, setWallet] = useState('');
  const navigate = useNavigate();
  const web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(TIDEABI, ContractAddress);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      tracking_number: '',
    },
  });
  const getCustomerDetails = async () => {
    try {
      let accounts = await web3.eth.getAccounts();
      let address = accounts[0];
      setWallet(address);
      let transaction = await contract.methods
        .getBuyerDetails(id)
        .call({ from: address });

      setPersonInfo({
        email: transaction.Email,
        full_name: transaction.FullName,
        phone: transaction.Phone,
        full_address: transaction.FullAddress,
        shipping: transaction.Shipping,
        buyer: transaction.buyer,
      });
    } catch (error) {
      console.error('Error fetching NFT:', error);
    }
  };

  const onSubmit = async values => {
    try {
      let address = await web3.eth.getAccounts();
      address = address[0];
      const tokenURI = await contract.methods.tokenURI(id).call();
      const pinHash = getHashFromUrl(tokenURI);

      await setTrackingNumber(pinHash, values.tracking_number);
      window.location.reload();
    } catch (error) {
      console.error('Error updating NFT:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        let accounts = await web3.eth.getAccounts();
        let address = accounts[0];
        setWallet(address);
        let transaction = await contract.methods
          .getTokenData(id)
          .call({ from: address });

        const tokenURI = await contract.methods.tokenURI(id).call();

        let meta = await axios.get(tokenURI);
        meta = meta.data;

        const price = meta.price;

        const expiryDate = formatSellerExpiryDate(
          meta.expiryState,
          meta.expiryDays,
          meta.expiryTimeStamp,
        );

        let is_expired =
          parseInt(meta.expiryState) === 1 && isExpired(meta.expiryTimeStamp);

        var data = {
          price,
          tokenId: parseInt(transaction.tokenId),
          seller: transaction.seller,
          expiryDate: expiryDate,
          state: parseInt(transaction.state),
          is_expired: is_expired,
          listingStatus: await getListingsStatus(tokenURI),
          owner: transaction.owner,
          offer: transaction.offer,
          orderNumber: transaction.orderNumber,
          image: meta.image,
          name: meta.name,
          description: meta.description,
          selectedOptions: meta.selectedOptions,
        };

        setData(data);
        updateFetched(true);
      } catch (error) {
        console.error('Error fetching NFT:', error);
      }

      try {
        getCustomerDetails();
      } catch (error) {
        console.error('Error fetching NFT:', error);
      }
    };

    fetchData();
  }, [id]);

  if (dataFetched === false) {
    return <p className='text-center mt-10'>Loading...</p>;
  } else if (dataFetched === true && data.seller !== wallet) {
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
          <style>
            {`
              .watermark {
                position: absolute;
                opacity: 0.35;
                font-size: 13em;
                width: 100%;
                text-align: center;
                z-index: 1000;
                transform: rotate(-20deg);
              }
            `}
          </style>

          <div className='mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
            <div className='lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8'>
              {data.is_expired && <div className='watermark'>EXPIRED</div>}

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
                    {data.expiryDate}
                  </p>
                </div>

                {!data.is_expired
                  ? data.offer !== EthreumNull &&
                    data.listingStatus === 'Listed' &&
                    data.state == 1 && (
                      <Accordion
                        className='mt-2'
                        sx={{
                          borderRadius: '10px',
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls='panel1-content'
                          id='panel1-header'
                        >
                          Customer Details
                        </AccordionSummary>
                        <AccordionDetails>
                          <p className='text-sm mb-3'>
                            Wallet Address:{' '}
                            <a
                              href={`https://etherscan.io/address/${personInfo.buyer}`}
                              className='inline hover:text-indigo-600 underline'
                            >
                              {personInfo.buyer}
                            </a>
                          </p>
                          <p>Email: {personInfo.email}</p>
                          {personInfo.full_name !== '' ? (
                            <p>Name: {personInfo.full_name}</p>
                          ) : null}

                          <p>Address: {personInfo.full_address}</p>
                          {personInfo.phone !== '' ? (
                            <p>Phone number: {personInfo.phone}</p>
                          ) : null}
                        </AccordionDetails>
                      </Accordion>
                    )
                  : null}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='mt-10 space-y-6'
                >
                  <div className='w-full'>
                    <label
                      htmlFor='last-name'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Enter Tracking Number
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='last-name'
                        id='last-name'
                        autoComplete='family-name'
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        {...register('tracking_number')}
                      />
                    </div>
                    {errors.tracking_number?.message && (
                      <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                        {errors.tracking_number.message}
                      </p>
                    )}
                  </div>
                  <button
                    type='submit'
                    className='inline-flex items-center px-4 py-2  mt-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
