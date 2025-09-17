import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
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
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async (user) => {
      if (!user) return null;
      try {
        const { data, error } = await supabase.from('tourists').select('*').eq('id', user.id).single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
      } catch (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const userProfile = await fetchProfile(session.user);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout session={session} profile={profile} />}>
          <Route index element={<DashboardHome />} />
          <Route path="my-account" element={<MyAccount session={session} profile={profile} />} />
          <Route path="geofencing" element={<Geofencing session={session} />} />
          <Route path="digital-id" element={<DigitalId session={session} profile={profile} />} />
          <Route path="about-us" element={<AboutUs />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;