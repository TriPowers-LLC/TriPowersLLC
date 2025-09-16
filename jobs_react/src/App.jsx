import React, { useState, useEffect} from 'react';
import { store } from './actions/store';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import UnderConstruction from './components/UnderConstruction';
import Services from './components/Services';
import Contact from './components/Contact';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Careers from './components/Careers';
import Admin from './components/Admin';
import Login from './components/Login';
import api from './api/client';
import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  return localStorage.getItem('token')
    ? children
    : <Navigate to="/login" replace />;
}

const App = ()=> {
  const [data, setData] = useState('');

  useEffect(() => {
  (async () => {
    try {
      const res = await api.get('/health'); // was `/api/message`; use a real endpoint
      setData(JSON.stringify(res.data));
    } catch (err) {
      console.error('API check failed:', err.message);
    }
    })();
  }, []);

  return (
    <> 
      <Provider store={store}>
        <Router>       
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <Admin />
                </RequireAuth>
              }
            />

            {/* <Route path="/" element={<UnderConstruction />} /> */}
          </Routes>
          <Services/>
          
        </Router>
       
      </Provider>
    </>
  );
}

export default App;
