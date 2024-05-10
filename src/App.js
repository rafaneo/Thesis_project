import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Marketplace from './components/marketplace';
import Product from './components/product';
import Header from './components/header';
import Example from './components/product_details_test';
import Login from './components/login';
import Footer from './components/footer';
import TestForm from './components/test_form';
import CreateListing from './components/create_listing';
import EditUserSettings from './components/edit-user-settings';
import MyListings from './components/my_listings';
import ListingView from './components/view_offer';
import ShoppingCart from './components/shopping-cart';
import ViewTokenData from './components/ViewTokenData';
import Purchase from './components/purchase_product';
import Web3 from 'web3';
import './index.css';

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
              <Route path='/my_listings' element={<MyListings />} />
              <Route path='/create_listing' element={<CreateListing />} />
              <Route path='/product' element={<Example />} />
              <Route path='/view_token_data/' element={<ViewTokenData />} />
              {/*This is for testing */}
              <Route path='/product/:id' element={<Product />} />
              <Route path='/product/:id/purchase' element={<Purchase />} />
              <Route path='/settings' element={<EditUserSettings />} />
              <Route path='/test_form' element={<TestForm />} />
              <Route path='/view_listing/:id' element={<ListingView />} />
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
