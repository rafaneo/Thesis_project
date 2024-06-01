import '../css/product_details.css';
import { formatSellerExpiryDate } from '../../../utils';
const ProductDetails = ({ product }) => {
  return (
    <div
      key={product.tokenId}
      className='group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white'
    >
      <div className='aspect-h-3 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96'>
        <img
          src={product.image}
          alt={product.imageAlt}
          className='h-full w-full object-cover object-center sm:h-full sm:w-full'
        />
      </div>
      <div className='flex flex-1 flex-col space-y-2 p-4'>
        <h3 className='text-sm font-medium text-gray-900 truncate'>
          <span aria-hidden='true' className='absolute inset-0' />
          {product.name}
        </h3>
        <p className='text-sm text-gray-500 truncate' aria-hidden='true'>
          {product.description}
        </p>
        <p className='text-sm text-gray-500 truncate' aria-hidden='true'>
          {product.expiryDate}
        </p>
        <div className='flex flex-1 flex-col justify-end'>
          <p className='text-base font-medium text-gray-900'>
            {product.price} TiDE
          </p>
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
