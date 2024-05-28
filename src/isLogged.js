import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3 } from 'web3';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
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
    // if (typeof window.ethereum !== 'undefined') {
    //   window.ethereum
    //     .request({ method: 'eth_accounts' })
    //     .then(accounts => {
    //       if (accounts.length > 0) {
    //         setIsLoggedIn(true);
    //       } else {
    //         setIsLoggedIn(false);
    //       }
    //     })
    //     .catch(err => {
    //       console.error('Error checking MetaMask accounts:', err);
    //     });
    // } else {
    //   setIsLoggedIn(false);
    // }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
