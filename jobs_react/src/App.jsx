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

function RequireAuth({ children }) {
  return localStorage.getItem('token')
    ? children
    : <Navigate to="/login" replace />;
}

const App = ()=> {
  const [data, setData] = useState('');

  useEffect(() => {
  (async () => {
    const res = await fetch(`/api/message`);
    if (res.ok) {
      const { text } = await res.json();
      setData(text);
    } else {
      console.error('Message fetch failed:', res.status);
    }
  })();
}, []);      // ← run only once on mount
  console.log('App data:', data); // Debugging line to check fetched data
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
