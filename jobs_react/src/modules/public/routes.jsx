import About from '../../components/About';
import Careers from '../../components/Careers';
import Contact from '../../components/Contact';
import Home from '../../components/Home';
import Login from '../../components/Login';
import Portfolio from '../../components/Portfolio';
import UnderConstruction from '../../components/UnderConstruction';

export const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/contact', element: <Contact /> },
  { path: '/about', element: <About /> },
  { path: '/portfolio', element: <Portfolio /> },
  { path: '/careers', element: <Careers /> },
  { path: '/login', element: <Login /> },
  { path: '/under-construction', element: <UnderConstruction /> },
];

export default publicRoutes;
