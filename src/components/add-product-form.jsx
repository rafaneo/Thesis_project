import { PhotoIcon } from '@heroicons/react/24/solid'

// name, price, description, imageSrc, imageAlt, type,
// alcohol, country, grape, year, sizes, tags

export default function AddProductForm() {
  return (
    <form>
      <div className='space-y-12'>
        <div className='border-b border-gray-900/10 pb-12'>
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
            General
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            General information about the product you're adding.
          </p>

          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='col-span-full'>
              <label
                htmlFor='name'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Product Name
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='name'
                  id='name'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div className='col-span-full'>
              <label
                htmlFor='description'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Description
              </label>
              <div className='mt-2'>
                <textarea
                  id='description'
                  name='description'
                  rows={3}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  defaultValue={''}
                />
              </div>
              <p className='mt-3 text-sm leading-6 text-gray-600'>
                Write a few sentences about your product.
              </p>
            </div>

            <div className='col-span-full'>
              <label
                htmlFor='cover-photo'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Photo
              </label>
              <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'>
                <div className='text-center'>
                  <PhotoIcon
                    className='mx-auto h-12 w-12 text-gray-300'
                    aria-hidden='true'
                  />
                  <div className='mt-4 flex text-sm leading-6 text-gray-600'>
                    <label
                      htmlFor='image'
                      className='relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'
                    >
                      <span>Upload a file</span>
                      <input
                        id='image'
                        name='image'
                        type='file'
                        className='sr-only'
                      />
                    </label>
                    <p className='pl-1'>or drag and drop</p>
                  </div>
                  <p className='text-xs leading-5 text-gray-600'>
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-6 flex items-center justify-end gap-x-6'>
        <button
          type='button'
          className='text-sm font-semibold leading-6 text-gray-900'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Save
        </button>
      </div>
    </form>
  )
}
