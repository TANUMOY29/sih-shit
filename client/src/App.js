
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import all page components
import Login from './components/Login';
import SignUp from './components/signup';
import AppLayout from './components/AppLayout';
import MyAccount from './components/MyAccount';
import Geofencing from './components/Geofencing';
import DigitalId from './components/DigitalId';
import AboutUs from './components/AboutUs';
import AdminDashboard from './components/AdminDashboard';
import DashboardHome from './components/DashBoardHome';

// A special component to protect routes and check roles
function RequireAuth({ session, profile, role, children }) {
    if (!session) {
        return <Navigate to="/login" />;
    }
    if (profile && profile.role !== role) {
        return <Navigate to="/" />;
    }
    return children;
}

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

        return () => {
            subscription.unsubscribe();
        };
    }, []);
 if (loading) {
        return <div>Loading Application...</div>;
    }
   

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected Admin Route */}
                <Route path="/admin" element={
                    <RequireAuth session={session} profile={profile} role="admin">
                        <AdminDashboard session={session} />
                    </RequireAuth>
                }/>

                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                    <RequireAuth session={session} profile={profile} role="user">
                        <AppLayout />
                    </RequireAuth>
                }>
                    <Route index element={<DashboardHome session={session} />} />
                    <Route path="account" element={<MyAccount session={session} />} />
                    <Route path="geofencing" element={<Geofencing session={session} />} />
                    <Route path="digital-id" element={<DigitalId session={session} />} />
                    <Route path="about" element={<AboutUs />} />
                </Route>
                
                {/* Default redirector */}
                <Route path="/" element={
                    !session ? <Navigate to="/login" /> : 
                    (profile?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)
                } />
            </Routes>
        </BrowserRouter>
    );
}
export default App;