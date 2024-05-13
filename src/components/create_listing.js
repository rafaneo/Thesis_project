import { useState, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import RadioSeries from './elements/radio_series/js/radio_series';
import LinearProgress from '@mui/material/LinearProgress';
import { uploadFileToIPFS, uploadJSONToIPFS } from './pinata';
import NFTUpload from './elements/nft_upload/js/nft_upload';
import { useLocation } from 'react-router';
import { Web3 } from 'web3';
import { ContractAddress, TIDEABI } from './abi/TideNFTABI';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { SHA256 } from 'crypto-js';
import * as yup from 'yup';

const schema = yup
  .object({
    name: yup
      .string()
      .max(50, 'First name must not exceed 25 characters...')
      .required('Listing tile is required!'),
    description: yup
      .string()
      .max(300, 'Description must not exceed 300 characters...'),
    price: yup
      .number('Price must be a number...')
      .typeError('Price must be a number...')
      .required('Listing price is required!')
      .min(1.0, 'Price must be greater than 0')
      .max(1000000, 'Price must be less than 1000000')
      .positive(),
    file: yup
      .mixed()
      .test('fileSize', 'File is too large', value => {
        if (!value) return true;
        return value[0].size <= 2000000;
      })
      .test(
        'fileType',
        'Unsupported file format (only png,jpge and jpg allowed)',
        value => {
          if (!value) return true;
          return (
            value[0].type === 'image/jpeg' ||
            value[0].type === 'image/png' ||
            value[0].type === 'image/jpg'
          );
        },
      )
      .required('You must upload a picture'),
  })
  .required();

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
    option_parent: 'consumable',
  },
  { id: 2, name: 'Cigars', field_type: 'select', option_parent: 'consumable' },
  {
    id: 3,
    name: 'Foods',
    field_type: 'select',
    option_parent: 'consumable',
  },
];
const ItemOptions = [
  { name: 'Items' },
  {
    id: 1,
    name: 'Electronics',
    field_type: 'select',
    option_parent: 'Item',
  },
  { id: 2, name: 'Clothing', field_type: 'select', option_parent: 'item' },
  { id: 3, name: 'Books', field_type: 'select', option_parent: 'item' },
];

const RentalOptions = [
  {
    id: 1,
    name: 'Expiration Date',
    field_type: 'date',
    option_parent: 'rental',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CreateListing() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      price: 1.0,
    },
  });
  const provider = new Web3.providers.HttpProvider(
    'https://eth-sepolia.g.alchemy.com/v2/2bsr75GEPZGZ5I8C7KYtiDpmCDTgQZk4',
  );

  const web3 = new Web3(window.ethereum);

  const [noFileMsg, setNoFileMsg] = useState('');
  const [uploadMessage, setUploadMessage] = useState(['', '']);
  const [showSpinner, setShowSpinner] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileUpload, setFileUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [selection, setSelection] = useState('');

  useEffect(() => {
    const imageUpload = uploadNFTImage();
    setFileUpload(imageUpload);
  }, [file]);

  var setTransactionApproved = false;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 1.0,
    country: 'Cyprus',
  });
  const location = useLocation();
  const [selectedProductType, setselectedProductType] = useState(
    productType[0],
  );
  const hashifyFileName = name => {
    const hashedString = SHA256(name).toString();
    return hashedString;
  };
  async function disableButton() {
    const listButton = document.getElementById('list-button');
    listButton.disabled = true;
    listButton.style.backgroundColor = 'grey';
    listButton.style.opacity = 0.3;
  }

  async function enableButton() {
    const listButton = document.getElementById('list-button');
    listButton.disabled = false;
    listButton.style.backgroundColor = '#4f46e5';
    listButton.style.opacity = 1;
  }

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const onSubmit = data => {
    console.log(data);
  };

  async function uploadNFTImage() {
    try {
      disableButton();

      const file_name_hash = hashifyFileName(file[0].name);
      const response = await uploadFileToIPFS(file, file_name_hash);
      setShowSpinner(true);
      if (response.success === true) {
        setTimeout(() => {
          setShowSpinner(false);
          enableButton();
        }, 2000);
        console.log('Uploaded image to Pinata: ', response.pinataURL);
        setFileUrl(response.pinataURL);
        return 1;
      }
    } catch (e) {
      enableButton();
      console.log('Error during file upload');
      return -1;
    }
  }

  async function uploadMetadataToIPFS() {
    const { name, description, price, country } = formData;
    console.log(formData);
    if (!name || !price) {
      return -1;
    }
    const nftJSON = {
      name,
      description,
      price,
      country,
      image: fileUrl,
      attributes: selection,
    };
    try {
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        return response.pinataURL;
      }
    } catch (e) {
      console.log('error uploading JSON metadata:', e);
    }
  }
  async function listNFT(e, data) {
    e.preventDefault();
    handleSubmit(onSubmit)();
    if (file === null || file === undefined || file.length === 0) {
      setNoFileMsg('Please upload a file');
      return;
    }
    try {
      setNoFileMsg('');
      if (fileUpload) {
        const metadataURL = await uploadMetadataToIPFS();
        console.log('metadataURL:', metadataURL);

        if (metadataURL === -1) {
          setTimeout(() => {
            setShowSpinner(false);
          }, 2000);
          setUploadMessage(['failed', 'Error uploading product']);
          return;
        }

        const [signer] = await web3.eth.getAccounts();
        disableButton();
        setShowSpinner(true);
        setUploadMessage([
          '',
          'Uploading NFT(might take 5 mins).. please dont click anything!',
        ]);

        let contract = new web3.eth.Contract(TIDEABI, ContractAddress);
        const price_val = web3.utils.toWei(formData.price, 'ether');

        let listingPrice = await contract.methods.getListingPrice().call();
        let nonce = await web3.eth.getTransactionCount(signer);
        console.log('nonce', nonce);
        let transaction = await contract.methods
          .createToken(metadataURL, price_val, data.expiryTimeStamp)
          .send({
            from: signer,
            value: listingPrice,
            gas: 3000000,
            gasPrice: web3.utils.toWei('100', 'gwei'), // Adjust the gas price here
          })
          .on('transactionHash', function (hash) {
            console.log('hash', hash);
          })
          .on('receipt', function (receipt) {
            console.log('reciept', receipt);
            setTransactionApproved = true;
          })
          .on('error', function (error) {
            console.error('error', error);
          });

        if (setTransactionApproved) {
          setTimeout(() => {
            setShowSpinner(false);
          }, 2000);
          setUploadMessage(['success', 'Product uploaded successfully!']);
          setFormData({
            name: '',
            description: '',
            price: '',
          });
          navigate('/'); // TODO change this to should listed nfts in the future!
        } else {
          setTimeout(() => {
            setShowSpinner(false);
          }, 2000);
          setUploadMessage(['failed', 'Error uploading product']);
          setFormData({
            name: '',
            description: '',
            price: '',
          });
          return;
        }
      } else {
        setTimeout(() => {
          setShowSpinner(false);
        }, 2000);
        setUploadMessage(['failed', 'Error uploading product']);
        return;
      }
    } catch (e) {
      alert('Upload error' + e);
    }
  }

  return (
    <div className='bg-gray-50'>
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-3xl lg:px-8'>
        <form
          className='lg:gap-x-12 xl:gap-x-16'
          onSubmit={e => listNFT(e, selection)}
        >
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
                  Listing Name <p className='inline text-red-500'>*</p>
                </label>
                <div className='mt-1'>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    {...register('name')}
                    onChange={handleChange}
                    className='block w-full rounded-md border-gray-500 shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-xl p-2'
                  />
                  {errors.name?.message && (
                    <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                      {errors.name.message}
                    </p>
                  )}
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
                    {...register('description')}
                    value={formData.description}
                    onChange={handleChange}
                    className='block rounded-md shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-l w-80 h-20 resize-none border rounded-md px-3 py-2 transition-all duration-500 ease-in-out'
                  />
                  {errors.description?.message && (
                    <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                      {errors.description.message}
                    </p>
                  )}
                  <style jsx>{`
                    textarea:focus,
                    textarea:hover {
                      width: 205%; /* Adjust the width on hover */
                      height: 130%; /* Adjust the height on hover */
                    }
                  `}</style>
                </div>

                <div className='sm:col-span-2'>
                  <label
                    htmlFor='price'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Price (TiDE) <p className='inline text-red-500'>*</p>
                  </label>
                  <div className='mt-1'>
                    <input
                      name='price'
                      id='price'
                      type='number'
                      {...register('price')}
                      onChange={handleChange}
                      value={formData.price}
                      className=' block w-[25%] rounded-md border-gray-500 shadow-xl focus:border-indigo-800 focus:ring-indigo-800 sm:text-l p-2'
                      placeholder=' 0.00'
                    />
                    {errors.price?.message && (
                      <p className='mt-2 ml-1 w-full text-red-400 text-sm font-normal'>
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className='border-gray-200 pt-4'>
                <RadioGroup
                  value={selectedProductType}
                  onChange={setselectedProductType}
                >
                  <RadioGroup.Label className='text-m font-medium text-gray-900'>
                    Product Type <p className='inline text-red-500'>*</p>
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
                  <RadioSeries
                    options={consumableOptions}
                    onSelectionChange={setSelection}
                  />
                </div>
              ) : selectedProductType.title === 'Item' ? (
                <div className='border-gray-200 pt-4'>
                  <RadioSeries
                    options={ItemOptions}
                    onSelectionChange={setSelection}
                  />
                </div>
              ) : (
                <div className='border-gray-200 pt-4'>
                  <RadioSeries
                    options={RentalOptions}
                    onSelectionChange={setSelection}
                  />
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
                      value={formData.country}
                      onChange={handleChange}
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
              <NFTUpload setFile={setFile} />
              {file === null ||
                file === undefined ||
                (file.length === 0 && (
                  <p className='text-red-600'>{noFileMsg}</p>
                ))}
            </div>
            <div className='mt-10 lg:mt-0'>
              {showSpinner ? (
                <div>
                  <p className='text-center text-lg font-medium text-gray-900'>
                    Uploading Image...Please wait
                  </p>
                  <LinearProgress />
                </div>
              ) : null}
              <div className='mt-4 rounded-lg border-gray-200'>
                <div className='border-t border-gray-200 px-4 py-6 sm:px-6'>
                  {uploadMessage[0] === 'success' ? (
                    <p className='mb-2 text-center text-lg font-medium text-green-400'>
                      {uploadMessage[1]}
                    </p>
                  ) : (
                    <p className='mb-2 text-center text-lg font-medium text-red-600'>
                      {uploadMessage[1]}
                    </p>
                  )}
                  <button
                    id='list-button'
                    type='submit'
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
