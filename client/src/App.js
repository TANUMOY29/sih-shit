
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

// A special component to protect routes
function RequireAuth({ session, children }) {
    if (!session) {
        return <Navigate to="/login" />;
    }
    return children;
}

function App() {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("App.js: useEffect started.");

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`App.js: onAuthStateChange fired with event: ${event}`);
            try {
                setSession(session);
                if (session) {
                    console.log("App.js: Session found. Fetching profile...");
                    const { data, error } = await supabase.from('tourists').select('role').eq('id', session.user.id).single();
                    if (error) throw error;
                    setProfile(data);
                    console.log("App.js: Profile fetched successfully.", data);
                } else {
                    setProfile(null);
                    console.log("App.js: No session, profile set to null.");
                }
            } catch (error) {
                console.error("App.js: Error during auth state change processing:", error);
            } finally {
                setLoading(false);
                console.log("App.js: Loading set to false.");
            }
        });

        return () => {
            console.log("App.js: Unsubscribing from auth changes.");
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
                    <RequireAuth session={session}>
                        {profile?.role === 'admin' ? <AdminDashboard session={session} /> : <Navigate to="/" />}
                    </RequireAuth>
                }/>

                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                    <RequireAuth session={session}>
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