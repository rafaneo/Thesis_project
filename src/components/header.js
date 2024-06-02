import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import { Web3 } from 'web3';
import LogoComponent from './elements/logo_comp';
import DropDown from './elements/drop_down/js/drop_down';

const navigation = [
  { name: 'All Listings', href: '/', privilage: 'all' },
  { name: 'Make a Listing', href: '/create_listing', privilage: 'logged' },
  { name: 'Manage Orders', href: '/manage_orders', privilage: 'logged' },
  { name: 'My Listings', href: '/my_listings', privilage: 'logged' },
  { name: 'Order History', href: '/order_history', privilage: 'logged' },
  { name: 'Settings', href: '/settings', privilage: 'logged' },
  // { name: 'Features', href: '/' },
  // { name: 'Marketplace', href: '#' },
  // { name: 'Company', href: '#' },
];

export default function Header() {
  const [connectedAccount, setConnectedAccount] = useState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  useEffect(() => {
    (async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setConnectedAccount(accounts[0]);
      }
    })();
  }, []);

  return (
    <header className='bg-white border'>
      <nav
        className='mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8'
        aria-label='Global'
      >
        <div className='flex items-center gap-x-12'>
          <a href='/' className='-m-1.5 p-1.5'>
            <LogoComponent />
          </a>
          <div className='hidden lg:flex lg:gap-x-12'>
            {navigation.map((item, index) =>
              connectedAccount === undefined &&
              item.privilage === 'logged' ? null : (
                <div key={index}>
                  <a
                    key={item.name}
                    href={item.href}
                    className={'text-sm font-semibold leading-6 text-gray-900'}
                  >
                    {item.name}
                  </a>
                  <div
                    className={
                      location.pathname === item.href
                        ? 'h-[3px] rounded-lg w-full bg-indigo-600'
                        : ''
                    }
                  />
                </div>
              ),
            )}
          </div>
        </div>
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <div className='hidden lg:flex'>
          {connectedAccount !== undefined ? (
            <DropDown
              connectedAccount={connectedAccount}
              menuItems={navigation}
            ></DropDown>
          ) : (
            <a
              href='/login'
              className='text-sm font-semibold leading-6 text-gray-900'
            >
              Log in <span aria-hidden='true'>&rarr;</span>
            </a>
          )}
        </div>
      </nav>
      <div
        as='div'
        className='lg:hidden'
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className='fixed inset-0 z-10' />
        <div className='fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <a href='/' className='-m-1.5 p-1.5'>
              <svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'>
                <path
                  style={{ fill: '#fdfefd', stroke: 'none' }}
                  d='M0 0L0 1024L1024 1024L1024 0L0 0z'
                />
                <path
                  style={{ fill: '#28788c', stroke: 'none' }}
                  d='M804 499L803 499C777.186 624.064 630.721 693.244 513 669.551C427.887 652.421 347.745 585.049 339.17 495C337.296 475.319 340.643 457.006 345 438L346 438C346 466.722 351.931 494.865 363.92 521C374.709 544.52 389.494 566.694 408.054 584.83C519.014 693.258 716.011 652.063 776.85 510C787.449 485.25 791.314 459.721 790.996 433C790.577 397.744 769.797 369.526 754 340L753 340C756.045 357.148 761.701 373.332 762.911 391C765.269 425.434 755.829 461.698 739.677 492C680.762 602.524 525.166 630.301 434.17 543.424C397.89 508.786 367.425 448.246 394.312 399C410.792 368.816 452.722 347.732 480.996 376.004C485.129 380.136 488.874 384.511 491.07 390C504.792 424.303 452.376 449.627 437 414C426.893 438.086 458.631 465.427 479 469.714C512.768 476.82 545.648 458.772 561.691 429C604.549 349.462 527.265 263.554 447 260.039C428.279 259.22 409.105 260.435 391 265.446C263.922 300.615 201.244 445.205 231.895 568C241.612 606.927 258.855 643.073 283.13 675C304.88 703.605 332.798 728.563 364 746.421C480.594 813.153 635.44 798.151 727.83 696C753.013 668.156 772.631 636.081 785.936 601C798.26 568.505 804 533.604 804 499z'
                />
                <path
                  style={{ fill: '#fdfefd', stroke: 'none' }}
                  d='M751 647C743.444 650.403 737.544 657.125 731 662.116C719.645 670.776 707.384 679.008 695 686.128C645.098 714.821 581.885 732.875 524 728.911C414.36 721.402 306.551 652.287 281.425 540C259.415 441.638 326.383 324.262 432 314.17C451.768 312.281 473.605 314.956 492 322.579C500.766 326.212 508.223 332.673 517 336C495.584 306.879 451.551 299.24 418 302.834C336.166 311.601 271.511 387.822 260.285 467C256.884 490.991 255.611 518.077 260.515 542C265.376 565.713 273.112 589.581 284.489 611C343.283 721.684 473.957 770.679 593 744.424C639.05 734.268 685 714.322 720 682.086C730.66 672.267 745.25 660.585 751 647z'
                />
              </svg>
            </a>
            <button
              type='button'
              className='-m-2.5 rounded-md p-2.5 text-gray-700'
              onClick={() => setMobileMenuOpen(true)}
            >
              <XMarkIcon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6'>
                {navigation.map((item, index) =>
                  connectedAccount === undefined &&
                  item.privilage === 'logged' ? null : (
                    <div key={index}>
                      <a
                        key={item.name}
                        href={item.href}
                        className={
                          'text-sm font-semibold leading-6 text-gray-900'
                        }
                      >
                        {item.name}
                      </a>
                      <div
                        className={
                          location.pathname === item.href
                            ? 'h-[3px] rounded-lg w-full bg-indigo-600'
                            : ''
                        }
                      />
                    </div>
                  ),
                )}
              </div>
              <div className='py-6'>
                <a
                  href='/'
                  className='-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
