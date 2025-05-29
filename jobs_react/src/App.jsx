import React, { useState, useEffect} from 'react';
import { store } from './actions/store';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import UnderConstruction from './components/UnderConstruction';
import Services from './components/Services';
import Contact from './components/Contact';

const App = ()=> {
  const [data, setData] = useState('');

  useEffect(() => {
    (async function () {
      const { text } = await( await fetch(`/api/message`)).json();
      setData(text);
    })();
  });
  return (
    <> 
      <Provider store={store}>
        <Router>       
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/" element={<UnderConstruction />} /> */}
          </Routes>
          <Services/>
          
        </Router>
       
      </Provider>
    </>
  );
}

export default App;
