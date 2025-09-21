import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import PublicLayout from './components/PublicLayout';
import DashboardHome from './components/DashBoardHome';
import MyAccount from './components/MyAccount';
import Geofencing from './components/Geofencing';
import DigitalId from './components/DigitalId';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import SignUp from './components/signup';
import { Spinner } from 'react-bootstrap';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  // A wrapper for protected routes
  const ProtectedRoutes = () => {
    return user ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="geofencing" element={<Geofencing />} />
            <Route path="digital-id" element={<DigitalId />} />
            <Route path="about-us" element={<AboutUs />} />
          </Route>
        </Route>
        
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;