
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { Button, Navbar, Nav, Container } from 'react-bootstrap';

// Import all your page components
import Login from './components/Login';
import SignUp from './components/signup';
import AppLayout from './components/AppLayout';
import MyAccount from './components/MyAccount';
import Geofencing from './components/Geofencing';
import DigitalId from './components/DigitalId';
import AboutUs from './components/AboutUs';
import AdminDashboard from './components/AdminDashboard';
import DashboardHome from './components/DashBoardHome';

function App() {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            if (session) {
                const { data } = await supabase.from('tourists').select('role').eq('id', session.user.id).single();
                setProfile(data);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading Application...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes: only show if NOT logged in */}
                <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
                <Route path="/signup" element={!session ? <SignUp /> : <Navigate to="/" />} />

                {/* Protected Admin Route */}
                <Route path="/admin" element={session && profile?.role === 'admin' ? <AdminDashboard session={session} /> : <Navigate to="/" />} />

                {/* THE KEY FIX IS HERE: We now check if the role is NOT admin */}
                <Route path="/dashboard" element={session && profile?.role !== 'admin' ? <AppLayout /> : <Navigate to="/" />}>
                    <Route index element={<DashboardHome session={session} />} />
                    <Route path="account" element={<MyAccount session={session} />} />
                    <Route path="geofencing" element={<Geofencing session={session} />} />
                    <Route path="digital-id" element={<DigitalId session={session} />} />
                    <Route path="about" element={<AboutUs />} />
                </Route>
                
                {/* Default redirector: This is the main traffic controller */}
                <Route path="/" element={
                    !session ? <Navigate to="/login" /> : 
                    (profile?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
                } />

                {/* A final catch-all to prevent errors */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;