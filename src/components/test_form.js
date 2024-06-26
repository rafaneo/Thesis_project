import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
  .object({
    firstName: yup
      .string()
      .max(25, 'First name must not exceed 25 characters...')
      .required('First name is required!'),
    phonenumber: yup
      .number('test')
      .max(25, 'Last name must not exceed 25 characters...')
      .required('Last name is required!'),
  })
  .required();

export default function TestForm() {
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
    },
  });

  // const onSubmit = values => {
  //   // HANDLE UPDATE HERE
  // };
  function onSubmit() {
    console.log('submitted');
  }

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
            This information cannot be changed. {JSON.stringify({ isDirty })}
          </p>

          <div className='grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6'>
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
                  type='text'
                  name='walletAddress'
                  id='walletAddress'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
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
                Phonenumber
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='last-name'
                  id='last-name'
                  autoComplete='family-name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  {...register('phonenumber')}
                />
              </div>
              {errors.phonenumber?.message && (
                <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                  {errors.phonenumber.message}
                </p>
              )}
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
