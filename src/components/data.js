const products = [
  {
    id: 1,
    name: 'Don Perignon 1',
    price: '$256',
    description: 'A very expensive Drink',

    imageSrc:
      'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
    imageAlt: 'A very expensive Drink',
    type: 'Pink',
    alchohol: '12%',
    country: 'France',
    grape: 'Merlot',
    year: '2008',
    sizes: [
      { name: '15cl', inStock: true },
      { name: '30cl', inStock: true },
      { name: '50cl', inStock: true },
      { name: '100cl', inStock: true },
      { name: '150cl', inStock: true },
      { name: '200cl', inStock: false },
    ],
    tags: ['used', 'drinks'],
  },
  {
    id: 2,
    name: 'Don Perignon 2',
    price: '$32',
    description:
      'Look like a visionary CEO and wear the same black t-shirt every day.',

    imageSrc:
      'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
    imageAlt: 'Front of plain black t-shirt.',
    tags: ['used', 'cigars'],
  },
  {
    id: 3,
    name: 'Don Perignon 3',
    price: '$32',
    description:
      'Look like a visionary CEO and wear the same black t-shirt every day.',

    imageSrc:
      'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
    imageAlt: 'Front of plain black t-shirt.',
    tags: ['used', 'drinks'],
  },
  {
    id: 4,
    name: 'Don Perignon 4',
    price: '$256',
    description:
      'Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.',

    imageSrc:
      'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
    imageAlt:
      'Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.',
    tags: ['used', 'cigars'],
  },
  {
    id: 5,
    name: 'Don Perignon 5',
    price: '$32',
    description:
      'Look like a visionary CEO and wear the same black t-shirt every day.',

    imageSrc:
      'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
    imageAlt: 'Front of plain black t-shirt.',
    tags: ['used', 'drinks'],
  },
  {
    id: 6,
    name: 'Don Perignon 6',
    price: '$32',
    description:
      'Look like a visionary CEO and wear the same black t-shirt every day.',

    imageSrc:
      'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
    imageAlt: 'Front of plain black t-shirt.',
    tags: ['used', 'drinks'],
  },
  {
    id: 7,
    name: 'Don Perignon 7',
    price: '$256',
    description:
      'Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.',

    imageSrc:
      'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
    imageAlt:
      'Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.',
    tags: ['used', 'cigars'],
  },
  {
    id: 8,
    name: 'Don Perignon 11',
    price: '$32',
    description:
      'Look like a visionary CEO and wear the same black t-shirt every day.',

    imageSrc:
      'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
    imageAlt: 'Front of plain black t-shirt.',
    tags: ['used', 'cigars'],
  },
  {
    id: 9,
    name: 'Don Perignon 22',
    price: '$32',
    description:
      'Look like a visionary CEO and wear the same black t-shirt every day.',

    imageSrc:
      'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
    imageAlt: 'Front of plain black t-shirt.',
    tags: ['new', 'drinks'],
  },
  {
    id: 10,
    name: 'Don Perignon 111',
    price: '$256',
    description:
      'Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.',

    imageSrc:
      'https://cdn11.bigcommerce.com/s-v55czzy8q4/images/stencil/1280x1280/products/507/1763/DOM-PERIGNON-ROSE-2008__39346.1667477319.jpg?c=1',
    imageAlt:
      'Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.',
    tags: ['new', 'drinks'],
  },
  {
    id: 11,
    name: 'Don Perignon 333',
    price: '$32',
    description:
      'Look like a visionary CEO and wear the same black t-shirt every day.',

    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg',
    imageAlt: 'Front of plain black t-shirt.',
    tags: ['used', 'drinks'],
  },
  {
    id: 12,
    name: 'Don Perignon 55',
    price: '$32',
    description:
      'Look like a visionary CEO and wear the same black t-shirt every day.',

    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg',
    imageAlt: 'Front of plain black t-shirt.',
    tags: ['used', 'cigars'],
  },
]

export default products
