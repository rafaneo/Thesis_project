import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './components/login';
import reportWebVitals from './reportWebVitals';

import Marketplace from './components/marketplace';
import Product from './components/product';
import Header from './components/header';
import App from './App';
import Example from './components/product_details_test';

const init = {
	routes: [
		{ path: '/login', element: <Login /> },
		{ path: '/', element: [<Header />, <Marketplace />  ] },
		{ path: '/product/:id', element: [<Product/>] },
		{ path: '/product/', element: [<Example/>] }

	],
};

const router = createBrowserRouter(init.routes);

ReactDOM.render(
	<React.StrictMode>
		<RouterProvider router={router}>
			<App />
		</RouterProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
