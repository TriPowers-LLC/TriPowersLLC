import React from 'react';
import { store } from './actions/store';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Applicants from './components/Applicants';
import NavBar from './components/NavBar';
import Home from './components/Home';
import UnderConstruction from './components/UnderConstruction';

function App() {
  return (
    <> 
      <Provider store={store}>
        <Router>
          <NavBar />
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path ="/under-construction" element={<UnderConstruction />} />
            
          </Routes>
        </Router>
        
      </Provider>
    </>
  );
}

export default App;
