
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
        // This is the official, stable way to handle auth and profile loading
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            if (session) {
                // Only fetch profile if there is a session
                const { data } = await supabase.from('tourists').select('role').eq('id', session.user.id).single();
                setProfile(data);
            } else {
                // If there's no session, clear the profile
                setProfile(null);
            }
            // IMPORTANT: Only stop loading after all async operations are done
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // This is the key fix: We show the loading screen until the initial check is complete.
    if (loading) {
        return <div>Loading Application...</div>;
    }

    // After loading, this logic decides where to go
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes: only show if NOT logged in */}
                <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
                <Route path="/signup" element={!session ? <SignUp /> : <Navigate to="/" />} />

                {/* Protected Admin Route */}
                <Route path="/admin" element={session && profile?.role === 'admin' ? <AdminDashboard session={session} /> : <Navigate to="/" />} />

                {/* Protected User Routes */}
                <Route path="/dashboard" element={session && profile?.role === 'user' ? <AppLayout /> : <Navigate to="/" />}>
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

                {/* A final catch-all to prevent 404 errors on initial load */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;