import EditUserSettings from './components/edit-user-settings';
import CreateListing from './components/create_listing';
import ViewTokenData from './components/ViewTokenData';
import OrderHistory from './components/order_history';
import ManageOrders from './components/manage_orders';
import Purchase from './components/purchase_product';
import ManageOrder from './components/manage_order';
import Marketplace from './components/marketplace';
import MyListings from './components/my_listings';
import ListingView from './components/view_offer';
import TestForm from './components/test_form';
import { useEffect, useState } from 'react';
import Product from './components/product';
import Header from './components/header';
import Footer from './components/footer';
import Login from './components/login';
import Web3 from 'web3';
import './index.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <div className=''>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Marketplace />} />
          {isLoggedIn && (
            <>
              {/*This is for testing */}
              <Route path='/view_token_data/' element={<ViewTokenData />} />
              <Route path='/my_listings' element={<MyListings />} />
              <Route path='/create_listing' element={<CreateListing />} />
              <Route path='/manage_orders' element={<ManageOrders />} />
              <Route path='/manage_order/:id' element={<ManageOrder />} />
              <Route path='/product/:id' element={<Product />} />
              <Route path='/product/:id/purchase' element={<Purchase />} />
              <Route path='/settings' element={<EditUserSettings />} />
              <Route path='/test_form' element={<TestForm />} />
              <Route path='/view_listing/:id' element={<ListingView />} />
              <Route path='/order_history' element={<OrderHistory />} />
            </>
          )}
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<h1>Not Found</h1>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
