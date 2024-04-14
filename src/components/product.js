import { useState, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import { useParams } from 'react-router-dom'
import products from './data'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Product() {
  const { id } = useParams()
  console.log(id)
  const [product, setProduct] = useState(null)

  const [selectedSize, setSelectedSize] = useState(null)

  // const product = products.find(product => product.id === parseInt(id));
  //Use this piece of code when you have a backend to fetch the product details
  //   useEffect(() => {
  //     fetch(`/api/products/${id}`)
  //       .then(response => response.json())
  //       .then(data => setProduct(data))
  //       .catch(error => console.error('Error fetching product:', error));
  //   }, [id]);

  useEffect(() => {
    console.log('Selected Product')
    const selectedProduct = products.find(
      product => product.id === parseInt(id),
    )

    setProduct(selectedProduct)
  }, [id])

  if (product === null) {
    return <p>Loading...</p>
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
                  href={product.href}
                  aria-current='page'
                  className='text-lg font-medium text-back hover:text-gray-600'
                >
                  {product.name}
                </p>
              </li>
            </ol>
          </nav>
          <div className='mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 border p-5'>
            <div className='lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8'>
              <div className='lg:col-span-5 lg:col-start-8'>
                <div className='flex justify-between'>
                  <h1 className='text-xl font-medium text-gray-900'>
                    {product.name}
                  </h1>
                  <p className='text-xl font-medium text-gray-900'>
                    {product.price}
                  </p>
                </div>
                {/* Reviews */}
                <div className='mt-4'>
                  <h2 className='sr-only'>Reviews</h2>
                  <div className='flex items-center'>
                    <p className='text-sm text-gray-700'>
                      {product.rating}
                      <span className='sr-only'> out of 5 stars</span>
                    </p>
                    <div className='ml-1 flex items-center'>
                      {[0, 1, 2, 3, 4].map(rating => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            product.rating > rating
                              ? 'text-yellow-400'
                              : 'text-gray-200',
                            'h-5 w-5 flex-shrink-0',
                          )}
                          aria-hidden='true'
                        />
                      ))}
                    </div>
                    <div
                      aria-hidden='true'
                      className='ml-4 text-sm text-gray-300'
                    >
                      ·
                    </div>
                    <div className='ml-4 flex'>
                      <a
                        href='/'
                        className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
                      >
                        See all {product.reviewCount} reviews
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image gallery */}
              <div className='grid grid-cols-2 mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0'>
                <div>
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className='rounded-lg w-auto h-auto object-center object-cover'
                  />
                </div>

                <div className='m-auto ml-7'>
                  <h2 className='text-lg font-medium text-gray-500 mb-10'>
                    Type:{' '}
                    <p className='text-gray-800 inline underline'>
                      {product.type}
                    </p>
                  </h2>
                  <h2 className='text-lg font-medium text-gray-500 mb-10'>
                    Year:{' '}
                    <p className='text-gray-800 inline underline'>
                      {product.year}
                    </p>
                  </h2>
                  <h2 className='text-lg font-medium text-gray-500 mb-10'>
                    Grape:{' '}
                    <p className='text-gray-800 inline underline'>
                      {product.grape}
                    </p>
                  </h2>
                  <h2 className='text-lg font-medium text-gray-500 mb-10'>
                    Alchohol:{' '}
                    <p className='text-gray-800 inline underline'>
                      {product.alchohol}
                    </p>
                  </h2>
                </div>
                {/* <div className='grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8'></div> */}
              </div>

              <div className='mt-8 lg:col-span-5'>
                <form>
                  {/* Color picker */}
                  <div>
                    <h2 className='text-sm font-medium text-gray-900'>Color</h2>
                  </div>

                  {/* Size picker */}
                  <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-sm font-medium text-gray-900'>
                        Size
                      </h2>
                      <a
                        href='/'
                        className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
                      >
                        See sizing chart
                      </a>
                    </div>

                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className='mt-2'
                    >
                      <RadioGroup.Label className='sr-only'>
                        Choose a size
                      </RadioGroup.Label>
                      <div className='grid grid-cols-3 gap-3 sm:grid-cols-6'>
                        {/* {product.sizes.map(size => (
                          <RadioGroup.Option
                            key={size.name}
                            value={size}
                            className={({ active, checked }) =>
                              classNames(
                                size.inStock
                                  ? 'cursor-pointer focus:outline-none'
                                  : 'cursor-not-allowed opacity-25',
                                active
                                  ? 'ring-2 ring-indigo-500 ring-offset-2'
                                  : '',
                                checked
                                  ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                                  : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
                                'flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1',
                              )
                            }
                            disabled={!size.inStock}
                          >
                            <RadioGroup.Label as='span'>
                              {size.name}
                            </RadioGroup.Label>
                          </RadioGroup.Option>
                        ))} */}
                      </div>
                    </RadioGroup>
                  </div>
                  <button
                    type='submit'
                    className='mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  >
                    Add to cart
                  </button>
                </form>

                {/* Product details */}
                <div className='mt-10'>
                  <h2 className='text-sm font-medium text-gray-900'>
                    Description
                  </h2>

                  <div
                    className='prose prose-sm mt-4 text-gray-500'
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}