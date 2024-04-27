import { useState, useCallback } from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
import RadioSeries from './elements/radio_series/js/radio_series';

import { uploadFileToIPFS, uploadJSONToIPFS } from './pinata';
import NFTUpload from './elements/nft_upload/js/nft_upload';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const productType = [
  {
    id: 1,
    title: 'Consumable',
  },
  { id: 2, title: 'Item' },
  {
    id: 3,
    title: 'Rental-Service',
  },
];

const consumableOptions = [
  {
    id: 1,
    name: 'Wines & Spirits',
    field_type: 'select',
  },
  { id: 2, name: 'Cigars', field_type: 'select' },
  {
    id: 3,
    name: 'Foods',
    field_type: 'select',
  },
];
const ItemOptions = [
  {
    id: 1,
    name: 'Color',
    field_type: 'select',
  },
  { id: 2, name: 'Size', field_type: 'select' },
];

const RentalOptions = [
  {
    id: 1,
    name: 'Expiration Date',
    field_type: 'date',
  },
  { id: 2, name: 'Other', field_type: 'radio' },
];

export default function CreateListing() {
  const ethers = require('ethers');

  const [value, setValue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fileUrl: '',
    country: 'Cyprus',
  });

  const [selectedProductType, setselectedProductType] = useState(
    productType[0],
  );

  function setFileURL(url) {
    setFormData({
      ...formData,
      fileUrl: url,
    });
  }

  console.log('fileUrl:', formData.fileUrl);
  const handleValueChange = e => {
    const inputValue = e.target.value;

    if (/^\d*\.?\d*$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    const { name, email } = formData;

    console.log('Form submitted with:', { name, email });
  };
  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // async function OnChangeFile(e) {
  //   var file = e.target.files[0];
  //   try {
  //     disableButton();
  //     updateMessage('Uploading image.. please dont click anything!');
  //     const response = await uploadFileToIPFS(file);
  //     if (response.success === true) {
  //       enableButton();
  //       updateMessage('');
  //       console.log('Uploaded image to Pinata: ', response.pinataURL);
  //       setFileURL(response.pinataURL);
  //     }
  //   } catch (e) {
  //     console.log('Error during file upload', e);
  //   }
  // }
  async function uploadMetadataToIPFS() {
    const { name, description, price } = formData;

    if (!name || !description || !price) {
      // updateMessage('Please fill all the fields!');
      return -1;
    }
    // const nftJSON = {
    //   name,
    //   description,
    //   price,
    //   image: fileURL,
    // };

    // try {
    //   const response = await uploadJSONToIPFS(nftJSON);
    //   if (response.success === true) {
    //     console.log('Uploaded JSON to Pinata: ', response);
    //     return response.pinataURL;
    //   }
    // } catch (e) {
    //   console.log('error uploading JSON metadata:', e);
    // }
  }

  // async function disableButton() {
  //   const listButton = document.getElementById('list-button');
  //   listButton.disabled = true;
  //   listButton.style.backgroundColor = 'grey';
  //   listButton.style.opacity = 0.3;
  // }

  // async function listNFT(e) {
  //   e.preventDefault();
  //   try {
  //     const metadataURL = await uploadMetadataToIPFS();
  //     if (metadataURL === -1) return;

  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     disableButton();
  //     updateMessage(
  //       'Uploading NFT(takes 5 mins).. please dont click anything!',
  //     );

  //     let contract = new ethers.Contract(
  //       Marketplace.address,
  //       Marketplace.abi,
  //       signer,
  //     );

  //     const price = ethers.utils.parseUnits(formParams.price, 'ether');
  //     let listingPrice = await contract.getListPrice();
  //     listingPrice = listingPrice.toString();

  //     let transaction = await contract.createToken(metadataURL, price, {
  //       value: listingPrice,
  //     });
  //     await transaction.wait();

  //     alert('Successfully listed your NFT!');
  //     enableButton();
  //     updateMessage('');
  //     updateFormParams({ name: '', description: '', price: '' });
  //     window.location.replace('/');
  //   } catch (e) {
  //     alert('Upload error' + e);
  //   }
  // }

  return (
    <div className='bg-gray-50'>
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-3xl lg:px-8'>
        <form className='lg:gap-x-12 xl:gap-x-16'>
          <div className='border border-1 p-9'>
            <div>
              <p className='text-center text-2xl font-medium text-gray-900'>
                Create a listing
              </p>

              <div className='mt-4'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Listing Name
                </label>
                <div className='mt-1'>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='block w-full rounded-md border-gray-500 shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-xl p-2'
                  />
                </div>
              </div>
            </div>

            <div className='pt-8'>
              <label
                htmlFor='email-address'
                className='block text-sm font-medium text-gray-700'
              >
                Listing Description
              </label>
              <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
                <div className='relative'>
                  <textarea
                    type='text'
                    id='description'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    className='block rounded-md shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-l w-40 h-12 resize-none border rounded-md px-3 py-2 transition-all duration-500 ease-in-out'
                  />
                  <style jsx>{`
                    textarea:focus,
                    textarea:hover {
                      width: 130%; /* Adjust the width on hover */
                      height: 100%; /* Adjust the height on hover */
                    }
                  `}</style>
                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='company'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Price (TIDE)
                  </label>
                  <div className='mt-1'>
                    <input
                      name='company'
                      id='company'
                      value={value}
                      onChange={handleValueChange}
                      className='block w-[25%] rounded-md border-gray-500 shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-l p-2'
                      placeholder=' 0.00'
                    />
                  </div>
                </div>
              </div>
              <div className='border-gray-200 pt-4'>
                <RadioGroup
                  value={selectedProductType}
                  onChange={setselectedProductType}
                >
                  <RadioGroup.Label className='text-m font-medium text-gray-900'>
                    Product Type
                  </RadioGroup.Label>

                  <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-2 sm:w-[100%]'>
                    {productType.map(type => (
                      <RadioGroup.Option
                        key={type.id}
                        value={type}
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
                                  {type.title}
                                </RadioGroup.Label>
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

              {/* Second row of buttons */}
              {selectedProductType.title === 'Consumable' ? (
                <div className='border-gray-200 pt-4'>
                  <RadioSeries options={consumableOptions} />
                </div>
              ) : selectedProductType.title === 'Item' ? (
                <div className='border-gray-200 pt-4'>
                  <RadioSeries options={ItemOptions} />
                </div>
              ) : (
                <div className='border-gray-200 pt-4'>
                  <RadioSeries options={RentalOptions} />
                </div>
              )}

              <div className='mt-10 border-t '>
                <label
                  htmlFor='country'
                  className='block text-sm font-medium text-gray-700 mt-5'
                >
                  Listing Country
                </label>
                <div className='mt-1'>
                  <div className='mt-1'>
                    <select
                      id='country'
                      name='country'
                      autoComplete='country-name'
                      className='block w-[25%] p-3 rounded-md border-gray-500 shadow-xl bg-white focus:border-indigo-800 focus:ring-indigo-800 sm:text-l p-2'
                    >
                      <option>Cyprus</option>
                      <option>Greece</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* Upload NFT */}
            <div className='mt-10'>
              <NFTUpload />
            </div>
            <div className='mt-10 lg:mt-0'>
              <div className='mt-4 rounded-lg border-gray-200'>
                <div className='border-t border-gray-200 px-4 py-6 sm:px-6'>
                  <button
                    id='list-button'
                    type='submit'
                    // onClick=
                    className='w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50'
                  >
                    Create Listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}