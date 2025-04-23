import React from 'react';
import { store } from './actions/store';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import UnderConstruction from './components/UnderConstruction';
import logo from './assets/logo.jpg'; // Import your logo image
function App() {
  return (
    <> 
      <Provider store={store}>
        <Router>
          {/* <NavBar /> */}
          <Routes>
            {/* <Route path="/" element={<Home />} />  */}
            <Route path="/" element={<UnderConstruction />} />
          </Routes>
          <div className="flex justify-center items-center min-h-screen bg-white">
          <img
            src={logo}
            alt="Logo"
            className="App-logo"
          />
        </div>
          
        </Router>
        
      </Provider>
    </>
  );
}

export default App;
