import { ContractAddress, TIDEABI, EthreumNull } from './abi/TideNFTABI';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ModalDialog from './elements/dialog/js/dialog';
import axios from 'axios';
import Web3 from 'web3';

export default function ListingView(props) {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [personInfo, setPersonInfo] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [wallet, setWallet] = useState('');
  const navigate = useNavigate();
  const web3 = new Web3(window.ethereum);
  const [showModal, setShowModal] = useState(false);

  function handleDecline(e) {
    e.preventDefault();
    setShowModal(true);
  }

  function handleDecline2() {
    console.log('here2');
  }

  function handleWhoops() {
    console.log('here3');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let contract = new web3.eth.Contract(TIDEABI, ContractAddress);
        let accounts = await web3.eth.getAccounts();
        let address = accounts[0];
        setWallet(address);
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
        console.log(meta.data);
        var data = {
          price,
          tokenId: parseInt(transaction.tokenId),
          seller: transaction.seller,
          expiryDays: meta.data.attributes.expiry,
          expiryTimestamp: expiry,
          state: transaction.state,
          owner: transaction.owner,
          offer: transaction.offer,
          orderNumber: transaction.orderNumber,
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

      try {
        const response = await axios.get(
          'http://192.168.1.159:8000/api/getOrder',
          {
            headers: {
              'Order-Number': `${data.orderNumber}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log(response.data);
        setPersonInfo(response.data);
      } catch (error) {}
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, [id]);

  const acceptOffer = async e => {
    e.preventDefault();

    let contract = new web3.eth.Contract(TIDEABI, ContractAddress);

    let estimate_gas = await contract.methods.acceptOffer(id).estimateGas({
      from: wallet,
    });

    let owner = await contract.methods.ownerOf(id).call();
    let transaction = await contract.methods
      .acceptOffer(id)
      .send({ from: wallet, gas: estimate_gas });

    console.log(transaction);

    navigate('/my_listings');
  };

  if (dataFetched === false) {
    return <p className='text-center mt-10'>Loading...</p>;
  } else if (dataFetched === true && data.seller !== wallet) {
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
                <div className='mt-4'>
                  <h2 className='sr-only'>Reviews</h2>
                  <div className='flex items-center'>
                    <div
                      aria-hidden='true'
                      className='ml-4 text-sm text-gray-300'
                    >
                      ·
                    </div>
                  </div>
                </div>
              </div>

              {/* Image gallery */}
              <div className='grid grid-cols-2 mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0'>
                <div>
                  <img
                    src={data.image}
                    className='rounded-lg w-auto h-auto object-center object-cover'
                  />
                </div>

                <div className='ml-7'>
                  <h2 className='text-sm text-gray-500 mb-2'>
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
                      {data.expiryDays === undefined ? null : (
                        <span className='inline'>{data.expiryDays}-days </span>
                      )}
                      {data.expiryTimestamp}
                    </p>
                  </h2>
                </div>
                {/* <div className='grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8'></div> */}
              </div>

              {/* TODO Pull data based on order number  */}
              <div className='lg:col-span-5'>
                <form>
                  {data.offer !== EthreumNull ? (
                    <div>
                      <button
                        type='submit'
                        onClick={acceptOffer}
                        className='flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      >
                        Accept Offer
                      </button>
                      <button
                        onClick={handleDecline}
                        className='flex w-full items-center justify-center rounded-md border border-transparent bg-red-400 px-8 py-3 mt-3 text-base font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2'
                      >
                        Decline Offer
                      </button>
                      {showModal && (
                        <ModalDialog
                          title='Are you sure you want to decline the offer?'
                          text='Decline'
                          buttonText='Decline'
                          onConfirm={() => navigate('/my_listings')}
                        />
                      )}
                    </div>
                  ) : null}
                </form>
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
                {data.offer !== EthreumNull ? (
                  <Accordion
                    className='mt-2 '
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
                      {personInfo.name !== '' || personInfo.surname !== '' ? (
                        <p>
                          Name: {personInfo.name} {personInfo.surname}
                        </p>
                      ) : null}

                      <p>
                        Address: {personInfo.country}, {personInfo.city},{' '}
                        {personInfo.address}, Postal: {personInfo.postalCode}
                      </p>
                      {personInfo.phone !== '' ? (
                        <p>Phone number: {personInfo.phone}</p>
                      ) : null}
                    </AccordionDetails>
                  </Accordion>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
