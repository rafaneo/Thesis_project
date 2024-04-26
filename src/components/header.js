import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import { Web3 } from 'web3';
import DropDown from './elements/drop_down/js/drop_down';

const navigation = [
	{ name: 'All NFT', href: '/' },
	// { name: 'Features', href: '/' },
	// { name: 'Marketplace', href: '#' },
	// { name: 'Company', href: '#' },
];



export default function Header() {
	
	
	const [connectedAccount, setConnectedAccount] = useState();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const location = useLocation()
	useEffect(()=>{ 
		(async()=>{
			if (window.ethereum) {
				const web3 = new Web3(window.ethereum);
				const accounts = await web3.eth.getAccounts();
				setConnectedAccount(accounts[0]);
			}
		})();
	},[]);

	return (
		<header className="bg-white border">
			<nav
				className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
				aria-label="Global"
			>
				<div className="flex items-center gap-x-12">
					<a href="/" className="-m-1.5 p-1.5">
						<img
							className="h-8 w-auto"
							src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
							alt=""
						/>
					</a>
					<div className="hidden lg:flex lg:gap-x-12">
						{navigation.map((item, index) => (
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
						))}
					</div>
				</div>
				<div className="flex lg:hidden">
					<button
						type="button"
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
						onClick={() => setMobileMenuOpen(true)}
					>
						<Bars3Icon className="h-6 w-6" aria-hidden="true" />
					</button>
				</div>
				<div className="hidden lg:flex">
					{
						connectedAccount !== undefined ?  
						<DropDown connectedAccount={connectedAccount}></DropDown>
						: 					
						<a
							href="/login"
							className="text-sm font-semibold leading-6 text-gray-900"
						>
							Log in <span aria-hidden="true">&rarr;</span>
						</a>
					}
				</div>
			</nav>
			<div
				as="div"
				className="lg:hidden"
				open={mobileMenuOpen}
				onClose={setMobileMenuOpen}
			>
				<div className="fixed inset-0 z-10" />
				<div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
					<div className="flex items-center justify-between">
						<a href="/" className="-m-1.5 p-1.5">
							<img
								className="h-8 w-auto"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
								alt=""
							/>
						</a>
						<button
							type="button"
							className="-m-2.5 rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(false)}
						>
							<XMarkIcon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<div className="mt-6 flow-root">
						<div className="-my-6 divide-y divide-gray-500/10">
							<div className="space-y-2 py-6">
								{navigation.map((item) => (
									<a
										key={item.name}
										href={item.href}
										className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
									>
										{item.name}
									</a>
								))}
							</div>
							<div className="py-6">
								<a
									href="/"
									className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
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