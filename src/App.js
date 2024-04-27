import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Marketplace from './components/marketplace';
import Product from './components/product';
import Header from './components/header';
import Example from './components/product_details_test';
import Login from './components/login';
import Footer from './components/footer';
// import Web3_Storage from './components/w3Storage';
import CreateListing from './components/create_listing';
import './index.css';
import EditUserSettings from './components/edit-user-settings';

function App() {
  return (
    <div className=''>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Marketplace />} />
          <Route path='/login' element={<Login />} />
          <Route path='/product' element={<Example />} />{' '}
          {/*This is for testing */}
          <Route path='/product/:id' element={<Product />} />
          {/* <Route path='/web3_storage' element={<Web3_Storage />} /> */}
          <Route path='/create_listing' element={<CreateListing />} />
          <Route path='/settings' element={<EditUserSettings />} />
          <Route path='*' element={<h1>Not Found</h1>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
