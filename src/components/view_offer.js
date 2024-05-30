import { ContractAddress, TIDEABI, EthreumNull } from './abi/TideNFTABI';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { unlistProduct, reListProduct, getPinListByHash } from './pinata';
import { getHashFromUrl, formatPrice, formatExpiryDate } from './utils';
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

  async function getListingsStatus(tokenURI) {
    try {
      let hash = getHashFromUrl(tokenURI);
      const query = await getPinListByHash(hash);
      const listingStatus =
        query.keyvalues[0].listingStatus === null
          ? 'Unlisted'
          : query.keyvalues[0].listingStatus;
      return listingStatus; // Return the value
    } catch (error) {
      console.error('Error getting listing status:', error);
      return null; // Return null if there is an error
    }
  }

  async function list() {
    data.listingStatus = 'Listed';
    let address = await web3.eth.getAccounts();
    address = address[0];
    const tokenURI = await contract.methods.tokenURI(id).call();
    const pinHash = getHashFromUrl(tokenURI);
    await reListProduct(pinHash);
    window.location.reload();
  }

  async function unList() {
    data.listingStatus = 'Unlisted';
    let address = await web3.eth.getAccounts();
    address = address[0];
    const tokenURI = await contract.methods.tokenURI(id).call();
    const pinHash = getHashFromUrl(tokenURI);
    await unlistProduct(pinHash);
    window.location.reload();
  }

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

        const expiryDate = formatExpiryDate(
          meta.expiryState,
          meta.expiryDays,
          meta.expiryTimeStamp,
        );

        var data = {
          price,
          tokenId: parseInt(transaction.tokenId),
          seller: transaction.seller,
          expiryDate: expiryDate,
          state: parseInt(transaction.state),
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
        // const response = await axios.get(
        //   'http://192.168.1.159:8000/api/getOrder',
        //   {
        //     headers: {
        //       'Order-Number': `${data.orderNumber}`,
        //       'Content-Type': 'application/json',
        //     },
        //   },
        // );
        // console.log(response.data);
        // setPersonInfo(response.data);
      } catch (error) {}
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

    navigate('/my_listings');
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
                <form>
                  {data.listingStatus === 'Listed' ? (
                    data.offer !== EthreumNull ? (
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

                {data.offer !== EthreumNull && (
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
                )}
                {data.offer === EthreumNull && [0, 4].includes(data.state) && (
                  <button
                    onClick={() =>
                      data.listingStatus === 'Listed' ? unList() : list()
                    }
                    className={
                      (data.state === 0
                        ? 'bg-red-400 hover:bg-red-500'
                        : 'bg-indigo-600 hover:bg-indigo-700') +
                      ' flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    }
                  >
                    {data.listingStatus === 'Listed' ? 'Unlist' : 'List'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
