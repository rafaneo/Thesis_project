import logo from './logo.svg';
import Marketplace from './components/marketplace';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import Login from './components/login';


function App() {
	return (
		<div className="">
			<Header />
			<Marketplace />
		</div>
	);
}

export default App;
