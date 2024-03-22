import React, { useEffect, useState } from 'react';
import {
	MagnifyingGlassIcon,
	ArrowLongLeftIcon,
	ArrowLongRightIcon,
} from '@heroicons/react/24/outline';
const products = [
	{
		id: 1,
		name: 'Don Perignon 1',
		price: '$256',
		description:
			'Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.',
		options: '8 colors',
		imageSrc:
			'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
		imageAlt:
			'Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.',
	},
	{
		id: 2,
		name: 'Don Perignon 2',
		price: '$32',
		description:
			'Look like a visionary CEO and wear the same black t-shirt every day.',
		options: 'Black',
		imageSrc:
			'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
		imageAlt: 'Front of plain black t-shirt.',
	},
	{
		id: 3,
		name: 'Don Perignon 3',
		price: '$32',
		description:
			'Look like a visionary CEO and wear the same black t-shirt every day.',
		options: 'Black',
		imageSrc:
			'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
		imageAlt: 'Front of plain black t-shirt.',
	},
	{
		id: 4,
		name: 'Don Perignon 4',
		price: '$256',
		description:
			'Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.',
		options: '8 colors',
		imageSrc:
			'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
		imageAlt:
			'Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.',
	},
	{
		id: 5,
		name: 'Don Perignon 5',
		price: '$32',
		description:
			'Look like a visionary CEO and wear the same black t-shirt every day.',
		options: 'Black',
		imageSrc:
			'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
		imageAlt: 'Front of plain black t-shirt.',
	},
	{
		id: 6,
		name: 'Don Perignon 6',
		price: '$32',
		description:
			'Look like a visionary CEO and wear the same black t-shirt every day.',
		options: 'Black',
		imageSrc:
			'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
		imageAlt: 'Front of plain black t-shirt.',
	},
	{
		id: 7,
		name: 'Don Perignon 7',
		price: '$256',
		description:
			'Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.',
		options: '8 colors',
		imageSrc:
			'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
		imageAlt:
			'Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.',
	},
	{
		id: 8,
		name: 'Don Perignon 11',
		price: '$32',
		description:
			'Look like a visionary CEO and wear the same black t-shirt every day.',
		options: 'Black',
		imageSrc:
			'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
		imageAlt: 'Front of plain black t-shirt.',
	},
	{
		id: 9,
		name: 'Don Perignon 22',
		price: '$32',
		description:
			'Look like a visionary CEO and wear the same black t-shirt every day.',
		options: 'Black',
		imageSrc:
			'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
		imageAlt: 'Front of plain black t-shirt.',
	},
	{
		id: 10,
		name: 'Don Perignon 111',
		price: '$256',
		description:
			'Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.',
		options: '8 colors',
		imageSrc:
			'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
		imageAlt:
			'Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.',
	},
	{
		id: 11,
		name: 'Don Perignon 333',
		price: '$32',
		description:
			'Look like a visionary CEO and wear the same black t-shirt every day.',
		options: 'Black',
		imageSrc:
			'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg',
		imageAlt: 'Front of plain black t-shirt.',
	},
	{
		id: 12,
		name: 'Don Perignon 55',
		price: '$32',
		description:
			'Look like a visionary CEO and wear the same black t-shirt every day.',
		options: 'Black',
		imageSrc:
			'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg',
		imageAlt: 'Front of plain black t-shirt.',
	},
];
const page_length = 6;

export default function Marketplace() {
	const [searchInput, setSearchInput] = useState('');
	const [page_number, setPageNumber] = useState(1);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [page_number]);

	const filtered_products = products.filter((product, index) =>
		product.name.toLowerCase().includes(searchInput.toLowerCase()),
	);
	const startIdx = (page_number - 1) * page_length;
	const endIdx = startIdx + page_length;
	const displayedProducts = filtered_products.slice(startIdx, endIdx);

	const page_count = Math.ceil(filtered_products.length / page_length);

	const handleChange = (e) => {
		e.preventDefault();
		setSearchInput(e.target.value);
		setPageNumber(1);
	};

	return (
		<div className="bg-white">
			<div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 mb-10">
				<div className="flex flex-row justify-between">
					<h2 className="text-2xl font-semibold">Products</h2>
					<div className="flex items-center max-w-xs sm:max-w-md w-full mb-10">
						<label for="simple-search" class="sr-only">
							Search
						</label>
						<div className="relative w-full inline-flex">
							<MagnifyingGlassIcon
								className="absolute left-1 top-2 h-3 w-3 sm:h-6 sm:w-6"
								aria-hidden="true"
							/>
							<input
								type="text"
								value={searchInput}
								onChange={handleChange}
								id="simple-search"
								className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-7 p-2 "
								placeholder="Search items..."
								required
							/>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
					{displayedProducts.map((product) => (
						<div
							key={product.id}
							className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
						>
							<div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
								<img
									src={product.imageSrc}
									alt={product.imageAlt}
									className="h-full w-full object-cover object-center sm:h-full sm:w-full"
								/>
							</div>
							<div className="flex flex-1 flex-col space-y-2 p-4">
								<h3 className="text-sm font-medium text-gray-900">
									<a href={product.href}>
										<span aria-hidden="true" className="absolute inset-0" />
										{product.name}
									</a>
								</h3>
								<p className="text-sm text-gray-500">{product.description}</p>
								<div className="flex flex-1 flex-col justify-end">
									<p className="text-sm italic text-gray-500">
										{product.options}
									</p>
									<p className="text-base font-medium text-gray-900">
										{product.price}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-10">
					{page_number > 1 ? (
						<div className="-mt-px flex w-0 flex-1">
							<button
								onClick={() => setPageNumber(page_number - 1)}
								className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
							>
								<ArrowLongLeftIcon
									className="mr-3 h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
								Previous
							</button>
						</div>
					) : (
						<div className="flex-1 justify-end"></div>
					)}
					{page_number > 1 && (
						<div className="hidden md:-mt-px md:flex">
							<button
								onClick={() => setPageNumber(page_number - 1)}
								className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
							>
								{page_number - 1}
							</button>
						</div>
					)}
					<div className="md:-mt-px md:flex ">
						{/* <div className="h-[5px] rounded-lg w-full bg-indigo-800" /> */}

						<button className="font-bold items-center border-transparent px-4 pt-4 text-sm text-indigo-500 hover:border-gray-300 hover:text-gray-700 ">
							{page_number}
						</button>
					</div>
					{page_number < page_count && (
						<div className="hidden md:-mt-px md:flex">
							<button
								onClick={() => setPageNumber(page_number + 1)}
								className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
							>
								{page_number + 1}
							</button>
						</div>
					)}

					{page_number < page_count ? (
						<div className="-mt-px flex w-0 flex-1 justify-end">
							<button
								onClick={() => setPageNumber(page_number + 1)}
								className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
							>
								Next
								<ArrowLongRightIcon
									className="ml-3 h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</button>
						</div>
					) : (
						<div className="flex-1 justify-end"></div>
					)}
				</nav>
			</div>
		</div>
	);
}
