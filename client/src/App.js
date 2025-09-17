import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/signup';
import DashboardHome from './components/DashBoardHome';
import MyAccount from './components/MyAccount';
import AppLayout from './components/AppLayout';
import Geofencing from './components/Geofencing'; // Import new page
import AboutUs from './components/AboutUs'; // Import new page

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes that use the main layout with Navbar */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="geofencing" element={<Geofencing />} />
          <Route path="about-us" element={<AboutUs />} />
        </Route>

        {/* Routes without the main layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;