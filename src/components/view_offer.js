import { ContractAddress, TIDEABI, EthreumNull } from './abi/TideNFTABI';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { unlistProduct, reListProduct } from './pinata';
import {
  getHashFromUrl,
  getListingsStatus,
  formatSellerExpiryDate,
  isExpired,
} from './utils';
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
  const [showModal, setShowModal] = useState(false);
  const web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(TIDEABI, ContractAddress);

  function handleDecline(e) {
    e.preventDefault();
    setShowModal(true);
  }

  async function disableButton() {
    const listButton = document.getElementById('manage-listing-button');
    listButton.disabled = true;
    listButton.style.backgroundColor = 'grey';
    listButton.style.opacity = 0.3;
  }

  async function list() {
    try {
      disableButton();
      data.listingStatus = 'Listed';
      const tokenURI = await contract.methods.tokenURI(id).call();
      const pinHash = getHashFromUrl(tokenURI);
      let listing_promise = reListProduct(pinHash);
      await Promise.all([listing_promise]);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  async function unList() {
    try {
      disableButton();
      data.listingStatus = 'Unlisted';
      const tokenURI = await contract.methods.tokenURI(id).call();
      const pinHash = getHashFromUrl(tokenURI);
      let unlist_promise = unlistProduct(pinHash);
      await Promise.all([unlist_promise]);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

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
      // Handle error here
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

        console.log(data);
        setData(data);
        updateFetched(true);
      } catch (error) {
        console.error('Error fetching NFT:', error);
        // Handle error here
      }

      try {
        getCustomerDetails();
      } catch (error) {
        console.error('Error fetching NFT:', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, [id]);

  const acceptOffer = async e => {
    e.preventDefault();

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

  const declineOffer = async e => {
    e.preventDefault();

    let estimate_gas = await contract.methods.acceptOffer(id).estimateGas({
      from: wallet,
    });

    let owner = await contract.methods.ownerOf(id).call();
    let transaction = await contract.methods
      .acceptOffer(id)
      .send({ from: wallet, gas: estimate_gas });

    console.log(transaction);

    navigate(`/manage_orders/${id}`);
  };

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
                {data.is_expired === false ? (
                  <form>
                    {data.listingStatus === 'Listed' ? (
                      data.offer !== EthreumNull && data.state === 1 ? (
                        <div>
                          <button
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
                      ) : (
                        <button
                          disabled
                          className={
                            'flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-500'
                          }
                        >
                          Awaiting Offers
                        </button>
                      )
                    ) : null}
                  </form>
                ) : null}

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
                          {console.log(personInfo)}
                          <p>Email: {personInfo.email}</p>
                          {personInfo.full_name !== '' ? (
                            <p>Full Name: {personInfo.full_name}</p>
                          ) : null}

                          <p>Address: {personInfo.full_address}</p>
                          {personInfo.phone !== '' ? (
                            <p>Phone number: {personInfo.phone}</p>
                          ) : null}
                        </AccordionDetails>
                      </Accordion>
                    )
                  : null}

                {data.is_expired === false
                  ? data.offer === EthreumNull &&
                    [0, 4].includes(data.state) &&
                    ['Listed', 'Unlisted'].includes(data.listingStatus) && (
                      <button
                        onClick={() =>
                          data.listingStatus === 'Listed' ? unList() : list()
                        }
                        id='manage-listing-button'
                        className={
                          (data.state === 0
                            ? 'bg-red-400 hover:bg-red-500'
                            : 'bg-indigo-600 hover:bg-indigo-700') +
                          ' flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        }
                      >
                        {data.listingStatus === 'Listed' ? 'Unlist' : 'List'}
                      </button>
                    )
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
