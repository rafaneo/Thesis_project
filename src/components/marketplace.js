import React, { useEffect, useState } from 'react'

import {
  MagnifyingGlassIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} 

from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import './elements/sidebar/css/sidebar.css'
import Input from './elements/sidebar/js/input'
import products from './data'
import ProductDetails from './elements/product_details/js/product_details'
const page_length = 6

export default function Marketplace() {
  const [searchInput, setSearchInput] = useState('')
  const [page_number, setPageNumber] = useState(1)

  const [condition, setConditionInput] = useState('all')
  const [category, setCategoryInput] = useState('all')
  const [price, setPriceInput] = useState('all')
  const [brand] = useState('all')

  var sidebar_filter = [brand, condition, category, price]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page_number])

  const filtered_products = products.filter((product, index) =>
    product.name.toLowerCase().includes(searchInput.toLowerCase()),
  )

  const startIdx = (page_number - 1) * page_length
  const endIdx = startIdx + page_length
  const displayedProducts = filtered_products.slice(startIdx, endIdx)

  const sidebar_filtered_products = products.filter(product => {
    if (
      sidebar_filter.includes('all') ||
      sidebar_filter.every(tag => product.tags.includes(tag))
    ) {
      return (
        (condition === 'all' || product.tags.includes(condition)) &&
        (category === 'all' || product.tags.includes(category))
      )
    }
    return false
  })

  console.log('Array', displayedProducts)

  const page_count = Math.ceil(filtered_products.length / page_length)

  const handleChange = e => {
    e.preventDefault()
    setSearchInput(e.target.value)
    setPageNumber(1)
  }

  const handleConditionChange = event => {
    setConditionInput(event.target.value)
    setPageNumber(1)
  }

  const handleCategoryChange = event => {
    setCategoryInput(event.target.value)
    setPageNumber(1)
  }

  const handlePriceChange = event => {
    console.log('here')
    setPriceInput(event.target.value)
    setPageNumber(1)
  }

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 mb-10'>
        <div className='flex flex-row justify-between'>
          <h2 className='text-2xl font-semibold'>Products</h2>
          <div className='flex items-center max-w-xs sm:max-w-md w-full mb-10'>
            <label for='simple-search' class='sr-only'>
              Search
            </label>
            <div className='relative w-full inline-flex'>
              <MagnifyingGlassIcon
                className='absolute left-1 top-2 h-3 w-3 sm:h-6 sm:w-6'
                aria-hidden='true'
              />
              <input
                type='text'
                value={searchInput}
                onChange={handleChange}
                id='simple-search'
                className='bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-7 p-2 '
                placeholder='Search items...'
                required
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-7 gap-10'>
          <div>
            <div className='sidebar'>
              <div className='self-start'>
                <h2 className='text-2xl mb-2 mt-4'>Condition</h2>
                <div className='flex flex-col justify-center'>
                  <Input
                    type='radio'
                    value='all'
                    title='All'
                    name='radio-condition'
                    checked={condition === 'all'}
                    onChange={handleConditionChange}
                  />
                  <Input
                    type='radio'
                    value='new'
                    title='New'
                    name='radio-condition'
                    checked={condition === 'new'}
                    onChange={handleConditionChange}
                  />
                  <Input
                    type='radio'
                    value='used'
                    title='Used'
                    name='radio-condition'
                    checked={condition === 'used'}
                    onChange={handleConditionChange}
                  />
                </div>
              </div>
              <div className='self-start'>
                <h2 className='text-2xl mb-2 mt-4'>Category</h2>
                <div className='flex flex-col justify-center'>
                  <Input
                    value='all'
                    title='All'
                    name='radio-category'
                    onChange={handleCategoryChange}
                    checked={category === 'all'}
                  />
                  <Input
                    value='drinks'
                    title='Drinks'
                    name='radio-category'
                    checked={category === 'drinks'}
                    onChange={handleCategoryChange}
                  />
                  <Input
                    value='cigars'
                    title='Cigars'
                    name='radio-category'
                    checked={category === 'cigars'}
                    onChange={handleCategoryChange}
                  />
                </div>
              </div>
              <div className='self-start'>
                <h2 className='text-2xl mb-2 mt-4'>Price</h2>
                <div className='flex flex-col justify-start'>
                  <Input
                    value='all'
                    title='All'
                    name='radio-price'
                    onChange={handlePriceChange}
                    checked={price === 'all'}
                  />
                  <Input
                    value='50'
                    title='0-50'
                    name='radio-price'
                    checked={price === '50'}
                    onChange={handlePriceChange}
                  />
                  <Input
                    value='100'
                    title='50-100'
                    name='radio-price'
                    checked={price === '100'}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='col-span-6'>
            <div className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8'>
              {searchInput === ''
                ? sidebar_filtered_products.map(product => (
                    <Link to={`/product/${product.id}`}>
                      <ProductDetails product={product} />
                    </Link>
                  ))
                : displayedProducts.map(product => (
                    <Link to={`/product/${product.id}`}>
                      <ProductDetails product={product} />
                    </Link>
                  ))}
            </div>
          </div>
        </div>

        <nav className='flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-10'>
          {page_number > 1 ? (
            <div className='-mt-px flex w-0 flex-1'>
              <button
                onClick={() => setPageNumber(page_number - 1)}
                className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
              >
                <ArrowLongLeftIcon
                  className='mr-3 h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
                Previous
              </button>
            </div>
          ) : (
          
            <div className='flex-1 justify-end'></div>
          )}
          {page_number > 1 && (
            <div className='hidden md:-mt-px md:flex'>
              <button
                onClick={() => setPageNumber(page_number - 1)}
                className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
              >
                {page_number - 1}
              </button>
            </div>
          )}
          <div className='md:-mt-px md:flex '>
            {/* <div className="h-[5px] rounded-lg w-full bg-indigo-800" /> */}

            <button className='font-bold items-center border-transparent px-4 pt-4 text-sm text-indigo-500 hover:border-gray-300 hover:text-gray-700 '>
              {page_number}
            </button>
          </div>
          {page_number < page_count && (
            <div className='hidden md:-mt-px md:flex'>
              <button
                onClick={() => setPageNumber(page_number + 1)}
                className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
              >
                {page_number + 1}
              </button>
            </div>
          )}

          {page_number < page_count ? (
            <div className='-mt-px flex w-0 flex-1 justify-end'>
              <button
                onClick={() => setPageNumber(page_number + 1)}
                className='inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
              >
                Next
                <ArrowLongRightIcon
                  className='ml-3 h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
              </button>
            </div>
          ) : (
            <div className='flex-1 justify-end'></div>

          )}
        </nav>
      </div>
    </div>
  );
}
