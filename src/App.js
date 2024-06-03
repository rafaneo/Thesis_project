import EditUserSettings from './components/edit-user-settings';
import CreateListing from './components/create_listing';
import ViewTokenData from './components/ViewTokenData';
import OrderHistory from './components/order_history';
import ManageOrders from './components/manage_orders';
import Purchase from './components/purchase_product';
import PurchaseView from './components/view_purchase';
import ManageOrder from './components/manage_order';
import Marketplace from './components/marketplace';
import MyListings from './components/my_listings';
import ListingView from './components/view_offer';
import ViewOrder from './components/view_order';
import TestForm from './components/test_form';
import { useEffect, useState } from 'react';
import Product from './components/product';
import NotFound from './components/error';
import Header from './components/header';
import Footer from './components/footer';
import Login from './components/login';
import Web3 from 'web3';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    try {
      let web3;
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
      }

      web3.eth.getAccounts().then(async addr => {
        if (addr.length > 0) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      });
    } catch (e) {
      setFlag(true);
    }
  }, []);

  if (isLoggedIn === undefined && !flag)
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <CircularProgress />
      </div>
    );

  return (
    <div className=''>
      <Router>
        <Header />
        <Routes>
          {flag && <Route path='/' element={<Login />} />}
          <Route path='/' element={<Marketplace />} />
          <Route path='/product/:id' element={<Product />} />

          {isLoggedIn && (
            <>
              {/*This is for testing */}
              <Route path='/view_token_data/' element={<ViewTokenData />} />
              <Route path='/my_listings' element={<MyListings />} />
              <Route path='/create_listing' element={<CreateListing />} />
              <Route path='/manage_orders' element={<ManageOrders />} />
              <Route path='/manage_order/:id' element={<ManageOrder />} />
              <Route path='/product/:id/purchase' element={<Purchase />} />
              <Route path='/view_order/:id' element={<ViewOrder />} />
              <Route path='/settings' element={<EditUserSettings />} />
              <Route path='/test_form' element={<TestForm />} />
              <Route path='/view_listing/:id' element={<ListingView />} />
              <Route path='/view_purchase/:id' element={<PurchaseView />} />
              <Route path='/order_history' element={<OrderHistory />} />
            </>
          )}
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
