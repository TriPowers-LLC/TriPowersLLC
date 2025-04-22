import React from 'react';
import { store } from './actions/store';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './styles/App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';

function App() {
  return (
    <> 
      <Provider store={store}>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} /> 
          </Routes>
        </Router>
        
      </Provider>
    </>
  );
}

export default App;
