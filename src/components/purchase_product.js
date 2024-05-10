import { useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useParams, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import axios from 'axios';
import { ContractAddress, TIDEABI } from './abi/TideNFTABI';
import { TideABI, TideAddress } from './abi/TideTokenABI';
import { convertGasToTide } from './utils';

const deliveryMethods = [
  {
    id: 1,
    title: 'Standard',
    turnaround: '4–10 business days',
    price: '20.00',
  },
  {
    id: 2,
    title: 'Express',
    turnaround: '2–5 business days',
    price: '40.00',
  },
];
const paymentMethods = [
  { id: 'credit-card', title: 'Credit card' },
  { id: 'paypal', title: 'PayPal' },
  { id: 'etransfer', title: 'eTransfer' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Purchase() {
  const { id } = useParams();
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    deliveryMethods[0],
  );

  const [data, setData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [userAccount, setUserAccount] = useState('');
  const navigate = useNavigate();
  const web3 = new Web3(window.ethereum);

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

  const purchase = async e => {
    e.preventDefault();
    let contract = new web3.eth.Contract(TIDEABI, ContractAddress);
    let tokenContract = new web3.eth.Contract(TideABI, TideAddress);

    try {
      const total_before_gas =
        parseFloat(data.price) + parseFloat(selectedDeliveryMethod.price);

      // const gasEstimation = await contract.methods.makeOffer(id).estimateGas({
      //   from: userAccount,
      // });
      // console.log(gasEstimation);

      const approvalTx = await tokenContract.methods
        .approve(ContractAddress, total_before_gas)
        .send({
          from: userAccount,
        });
      console.log('Approval transaction hash:', approvalTx.transactionHash);

      const transaction = await contract.methods.makeOffer(id).send({
        from: userAccount,
        gas: 300000, // Use the estimated gas
      });
      console.log('Transaction:', transaction);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  if (dataFetched === false) {
    return <p className='text-center mt-10'>Loading...</p>;
  } else if ((dataFetched === true && data.state === 3) || data.state === 1) {
    navigate('/*');
  } else {
    return (
      <div className='bg-gray-50'>
        <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
          <h2 className='sr-only'>Checkout</h2>

          <form className='lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16'>
            <div>
              <div>
                <h2 className='text-lg font-medium text-gray-900'>
                  Contact information
                </h2>
                <div className='mt-4'>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Email address
                  </label>
                  <div className='mt-1'>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      // value={formData.name}
                      // {...register('name')}
                      // onChange={handleChange}
                      className='block w-full rounded-md border border-gray-200 shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-l p-2'
                    />
                    {/* {errors.name?.message && (
                      <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                        {errors.name.message}
                      </p>
                    )} */}
                  </div>
                </div>
              </div>

              <div className='mt-10 border-t border-gray-200 pt-10'>
                <h2 className='text-lg font-medium text-gray-900'>
                  Shipping information
                </h2>

                <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                  <div className='mt-4'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      First Name
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        // value={formData.name}
                        // {...register('name')}
                        // onChange={handleChange}
                        className='block w-full rounded-md border border-gray-200 shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-m p-2'
                      />
                      {/* {errors.name?.message && (
                      <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                        {errors.name.message}
                      </p>
                    )} */}
                    </div>
                  </div>

                  <div className='mt-4'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Last Name{' '}
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        // value={formData.name}
                        // {...register('name')}
                        // onChange={handleChange}
                        className='block w-full rounded-md border border-gray-200 shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-m p-2'
                      />
                      {/* {errors.name?.message && (
                      <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                        {errors.name.message}
                      </p>
                    )} */}
                    </div>
                  </div>
                  <div className='sm:col-span-2'>
                    <div className='mt-4'>
                      <label
                        htmlFor='name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Address
                      </label>
                      <div className='mt-1'>
                        <input
                          type='text'
                          id='name'
                          name='name'
                          // value={formData.name}
                          // {...register('name')}
                          // onChange={handleChange}
                          className='block w-full rounded-md border border-gray-200 shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-l p-2'
                        />
                        {/* {errors.name?.message && (
                      <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                        {errors.name.message}
                      </p>
                    )} */}
                      </div>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Apartment, suite, etc.
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        // value={formData.name}
                        // {...register('name')}
                        // onChange={handleChange}
                        className='block w-full rounded-md border border-gray-200 shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-m p-2'
                      />
                      {/* {errors.name?.message && (
                      <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                        {errors.name.message}
                      </p>
                    )} */}
                    </div>
                  </div>

                  <div className='mt-4'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      City{' '}
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        // value={formData.name}
                        // {...register('name')}
                        // onChange={handleChange}
                        className='block w-full rounded-md border border-gray-200 shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-m p-2'
                      />
                      {/* {errors.name?.message && (
                      <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                        {errors.name.message}
                      </p>
                    )} */}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor='country'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Country
                    </label>
                    <div className='mt-1'>
                      <div className='mt-1'>
                        <select
                          id='country'
                          name='country'
                          // value={formData.country}
                          // onChange={handleChange}
                          autoComplete='country-name'
                          className='block w-full rounded-md border border-gray-200 shadow-xl bg-white focus:border-indigo-800 focus:ring-indigo-800 sm:text-m p-2'
                        >
                          <option>Cyprus</option>
                          <option>Greece</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Postal Code{' '}
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        // value={formData.name}
                        // {...register('name')}
                        // onChange={handleChange}
                        className='block w-full rounded-md border border-gray-200 shadow-xl bg-white focus:border-indigo-800 focus:ring-indigo-800 sm:text-m p-2'
                      />
                      {/* {errors.name?.message && (
                      <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                        {errors.name.message}
                      </p>
                    )} */}
                    </div>
                  </div>

                  <div className='sm:col-span-2'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Phone number{' '}
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        // value={formData.name}
                        // {...register('name')}
                        // onChange={handleChange}
                        className='block w-full rounded-md border border-gray-200 shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-m p-2'
                      />
                      {/* {errors.name?.message && (
                      <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                        {errors.name.message}
                      </p>
                    )} */}
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-10 border-t border-gray-200 pt-10'>
                <RadioGroup
                  value={selectedDeliveryMethod}
                  onChange={setSelectedDeliveryMethod}
                >
                  <RadioGroup.Label className='text-lg font-medium text-gray-900'>
                    Delivery method
                  </RadioGroup.Label>

                  <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                    {deliveryMethods.map(deliveryMethod => (
                      <RadioGroup.Option
                        key={deliveryMethod.id}
                        value={deliveryMethod}
                        className={({ checked, active }) =>
                          classNames(
                            checked ? 'border-transparent' : 'border-gray-300',
                            active ? 'ring-2 ring-indigo-500' : '',
                            'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none',
                          )
                        }
                      >
                        {({ checked, active }) => (
                          <>
                            <span className='flex flex-1'>
                              <span className='flex flex-col'>
                                <RadioGroup.Label
                                  as='span'
                                  className='block text-sm font-medium text-gray-900'
                                >
                                  {deliveryMethod.title}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as='span'
                                  className='mt-1 flex items-center text-sm text-gray-500'
                                >
                                  {deliveryMethod.turnaround}
                                </RadioGroup.Description>
                                <RadioGroup.Description
                                  as='span'
                                  className='mt-6 text-sm font-medium text-gray-900'
                                >
                                  {deliveryMethod.price}
                                </RadioGroup.Description>
                              </span>
                            </span>
                            {checked ? (
                              <CheckCircleIcon
                                className='h-5 w-5 text-indigo-600'
                                aria-hidden='true'
                              />
                            ) : null}
                            <span
                              className={classNames(
                                active ? 'border' : 'border-2',
                                checked
                                  ? 'border-indigo-500'
                                  : 'border-transparent',
                                'pointer-events-none absolute -inset-px rounded-lg',
                              )}
                              aria-hidden='true'
                            />
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              {/* Payment */}
              <div className='mt-10 border-t border-gray-200 pt-10'></div>
            </div>

            {/* Order summary */}
            <div className='mt-10 lg:mt-0'>
              <h2 className='text-lg font-medium text-gray-900'>
                Order summary
              </h2>

              <div className='mt-4 rounded-lg border border-gray-200 bg-white shadow-sm'>
                <h3 className='sr-only'>Items in your cart</h3>
                <ul role='list' className='divide-y divide-gray-200'>
                  <li key={data.tokenId} className='flex px-4 py-6 sm:px-6'>
                    <div className='flex-shrink-0'>
                      <img src={data.image} className='w-20 rounded-md' />
                    </div>

                    <div className='ml-6 flex flex-1 flex-col'>
                      <div className='flex'>
                        <div className='min-w-0 flex-1'>
                          <h4 className='text-sm'>
                            <a
                              // href={product.href}
                              className='font-medium text-gray-700 hover:text-gray-800'
                            >
                              {data.name}
                            </a>
                          </h4>
                          <p className='mt-1 text-sm text-gray-500'>
                            {data.description}
                          </p>
                          <p className='mt-1 text-sm text-gray-500'>
                            Expiry: {data.expiryTimestamp}
                          </p>
                        </div>

                        <div className='ml-4 flow-root flex-shrink-0'>
                          <button
                            type='button'
                            className='-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500'
                          >
                            <span className='sr-only'>Remove</span>
                            <TrashIcon className='h-5 w-5' aria-hidden='true' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <dl className='space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6'>
                  <div className='flex items-center justify-between'>
                    <dt className='text-sm'>Subtotal</dt>
                    <dd className='text-sm font-medium text-gray-900'>
                      {data.price} TiDE
                    </dd>
                  </div>
                  <div className='flex items-center justify-between'>
                    <dt className='text-sm'>Shipping</dt>
                    <dd className='text-sm font-medium text-gray-900'>
                      {selectedDeliveryMethod.price} TiDE
                    </dd>
                  </div>
                  <div className='flex items-center justify-between border-t border-gray-200 pt-6'>
                    <dt className='text-base font-medium'>Total</dt>
                    <dd className='text-base font-medium text-gray-900'>
                      {parseFloat(data.price) +
                        parseFloat(selectedDeliveryMethod.price)}{' '}
                      TiDE
                    </dd>
                  </div>
                </dl>

                <div className='border-t border-gray-200 px-4 py-6 sm:px-6'>
                  <button
                    type='submit'
                    onClick={purchase}
                    className='w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50'
                  >
                    Confirm order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
