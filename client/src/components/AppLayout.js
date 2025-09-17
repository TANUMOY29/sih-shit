import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function AppLayout() {
    const { t } = useTranslation();
    const [profile, setProfile] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true); // Start in a loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async (user) => {
            try {
                const { data, error } = await supabase.from('tourists').select('full_name, role').eq('id', user.id).single();
                if (error) throw error;
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error.message);
            }
        };
        
        // This single listener handles the initial state, logins, and logouts
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                setSession(session);
                await fetchProfile(session.user);
            } else {
                // If there's no session, redirect to login
                navigate('/login');
            }
            // Once we have a session or have redirected, we are done loading
            setLoading(false);
        });

        // Cleanup the listener when the component unmounts
        return () => subscription.unsubscribe();
    }, [navigate]);


    const handleLogout = async () => {
        await supabase.auth.signOut();
        // The onAuthStateChange listener will automatically handle the redirect
    };

    // Show a full-page loading spinner while we check for the session
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">🛡️ Travel Shield</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me--auto">
                            <Nav.Link as={Link} to="/geofencing">{t('geofencingLink', 'Geofencing')}</Nav.Link>
                            <Nav.Link as={Link} to="/digital-id">{t('digitalIdLink', 'Digital ID')}</Nav.Link>
                            <Nav.Link as={Link} to="/about-us">{t('aboutUsLink', 'About Us')}</Nav.Link>
                        </Nav>
                        <Nav className="align-items-center ms-auto">
                            <LanguageSwitcher />
                            {profile && (
                                <NavDropdown title={profile.full_name || t('accountLink', 'Account')} id="collasible-nav-dropdown" className="ms-2">
                                    <NavDropdown.Item as={Link} to="/my-account">{t('myAccountLink', 'My Account')}</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>
                                        {t('logoutButton', 'Logout')}
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Outlet />
            </Container>
        </div>
    );
}