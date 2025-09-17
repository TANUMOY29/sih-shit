import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/signup';
import DashboardHome from './components/DashBoardHome';
import MyAccount from './components/MyAccount';
import AppLayout from './components/AppLayout';
import PublicLayout from './components/PublicLayout'; // Import new layout
import Geofencing from './components/Geofencing'; 
import AboutUs from './components/AboutUs';
import DigitalId from './components/DigitalId';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with the main, protected layout */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="geofencing" element={<Geofencing />} />
          <Route path="digital-id" element={<DigitalId />} />
          <Route path="about-us" element={<AboutUs />} />
        </Route>

        {/* Routes with the public layout (for login/signup) */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;