import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Services from './components/Services';
import Contact from './components/Contact';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Admin from './components/admin/admin';
import Login from './components/Login';
import JobList from './components/public/JobList';
import JobDetail from './components/public/JobDetail';
import MyApplications from './components/applications/MyApplications';

function RequireAuth({ allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || 'public';

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'applicant' ? '/myapplications' : '/careers'} replace />;
  }

  return <Outlet />;
}

const PublicLayout = () => (
  <>
    <NavBar />
    <main className="pt-20 px-4 md:px-8 max-w-6xl mx-auto">
      <Outlet />
    </main>
  </>
);

const AppLayout = () => (
  <>
    <NavBar />
    <main className="pt-20 px-4 md:px-8 max-w-6xl mx-auto">
      <Outlet />
    </main>
  </>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/careers" element={<JobList />} />
          <Route path="/apply/:id" element={<JobDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route element={<RequireAuth allowedRoles={['admin']} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={['applicant', 'admin']} />}>
            <Route path="/myapplications" element={<MyApplications />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;