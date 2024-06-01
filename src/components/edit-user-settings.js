import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';

const schema = yup
  .object({
    firstName: yup
      .string()
      .max(25, 'First name must not exceed 25 characters...')
      .required('First name is required!'),
    lastName: yup
      .string()
      .max(25, 'Last name must not exceed 25 characters...')
      .required('Last name is required!'),
  })
  .required();

export default function EditUserSettings() {
  const [userAccount, setUserAccount] = useState('');
  const [data, setData] = useState([]); // Added state variable
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      firstName: '',
      lastName: '',
      storeName: '',
    },
  });
  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    (async () => {
      try {
        let accounts = await web3.eth.getAccounts();
        let address = accounts[0];
        setUserAccount(address);
      } catch (e) {
        console.error(e.message);
      }
    })();

    (async () => {
      try {
        let accounts = await web3.eth.getAccounts();
        let address = accounts[0];
        const response = await axios.get(
          'http://16.16.19.83:8000/api/getAccountDetails',
          {
            headers: {
              'Wallet-Address': address,
            },
          },
        );
        if (response.status === 200) {
          const { name, surname, storename, wallet_address } = response.data;
          reset({
            firstName: name,
            lastName: surname,
            storeName: storename,
          });
        } else {
          console.log('Failed to get account details:', response.data.message);
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
    })();
  }, []);

  const onSubmit = async values => {
    try {
      const response = await axios.post(
        'http://16.16.19.83:8000/api/saveAccountDetails',
        {
          name: values.firstName,
          surname: values.lastName,
          storename: 'Johns Store',
          wallet_address: userAccount,
        },
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching NFT:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 lg:py-16 mb-10'
    >
      <div className='space-y-12'>
        <div className='pb-12 border-b border-gray-900/10'>
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Wallet
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            This information cannot be changed.
          </p>

          <div className='grid grid-col-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='sm:col-span-3'>
              <label
                htmlFor='walletAddress'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Wallet Address
              </label>
              <div className='mt-2'>
                <input
                  disabled
                  value={userAccount ?? ''}
                  type='text'
                  name='walletAddress'
                  id='walletAddress'
                  className='px-2 block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='pb-12 border-b border-gray-900/10'>
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Personal Information
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className='grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='sm:col-span-3'>
              <label
                htmlFor='first-name'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                First name
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  id='first-name'
                  autoComplete='given-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  {...register('firstName')}
                />
              </div>
              {errors.firstName?.message && (
                <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='last-name'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Last name
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='last-name'
                  id='last-name'
                  autoComplete='family-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  {...register('lastName')}
                />
              </div>
              {errors.lastName?.message && (
                <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div className='sm:col-span-3'>
              <label
                htmlFor='walletAddress'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Store Name
              </label>
              <div className='mt-2'>
                <input
                  {...register('storeName')}
                  type='text'
                  name='walletAddress'
                  id='walletAddress'
                  className='px-2 block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-end mt-6 gap-x-6'>
        <button
          className='text-sm font-semibold leading-6 text-gray-900'
          onClick={e => {
            e.preventDefault();
            reset();
          }}
          disabled={!isDirty || isSubmitting}
        >
          Cancel
        </button>
        <button
          type='submit'
          className='px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400'
          disabled={!isDirty || isSubmitting}
        >
          Save
        </button>
      </div>
    </form>
  );
}
