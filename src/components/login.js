import React, { useEffect } from 'react';
// import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Web3 } from 'web3';
import { useAuth } from '../isLogged';
import { useCookies } from 'react-cookie';

const ModelViewer = require('@metamask/logo');

// import { MetaMaskProvider } from "@metamask/sdk-react";
// import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";

export default function Login() {
  // const [connectedAccount, setConnectedAccount] = useState('null');
  const [cookies, setCookie, removeCookie] = useCookies(['isLogged']);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const viewer = ModelViewer({
      pxNotRatio: true,
      width: 200,
      height: 100,
      followMouse: true,
      slowDrift: true,
      lookAt: {
        x: 100,
        y: 100,
      },
    });

    const container = document.getElementById('logo-container');
    container.appendChild(viewer.container);

    return () => {
      viewer.stopAnimation();
      container.removeChild(viewer.container);
    };
  }, []);

  const navigate = useNavigate();

  async function connectMetamask() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // setConnectedAccount(accounts[0]);
      setCookie('isLogged', true, { path: '/' });
      navigate('/');
      window.location.reload();
    } else {
      window.location.href = 'https://metamask.io/download/';
    }
  }

  return (
    <>
      <div className='overflow-hidden flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-lg'>
          <img
            className='mx-auto h-12 w-auto'
            src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
            alt='Logo'
          />
          <h2 className='mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Sign in to your account
          </h2>
        </div>

        <div className='flex justify-center text-center mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
          <div className='bg-slate-50 px-10 py-12 shadow sm:rounded-xxl sm:px-15 '>
            <div className='px-[140px]' id='logo-container'></div>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-65'
              onClick={() => connectMetamask()}
            >
              Connect with Metamask
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
