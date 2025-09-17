import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function AppLayout() {
    const { t } = useTranslation();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async (user) => {
            // This is the safety check. If for any reason the user object is not valid, it will not proceed.
            if (!user) {
                setProfile(null);
                return;
            }
            try {
                const { data, error } = await supabase.from('tourists').select('full_name').eq('id', user.id).single();
                if (error) throw error;
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error.message);
                setProfile(null); // Clear profile on error
            }
        };

        // This single listener is the only source of truth for authentication
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                // If a session exists, we are authenticated. Now fetch the profile.
                await fetchProfile(session.user);
            } else {
                // If no session, the user is not logged in. Redirect them.
                navigate('/login');
            }
            // We are done checking, so we can stop loading.
            setLoading(false);
        });

        // Cleanup the listener when the component is no longer on screen
        return () => subscription.unsubscribe();
    }, [navigate]);


    const handleLogout = async () => {
        await supabase.auth.signOut();
        // The onAuthStateChange listener will automatically handle the redirect to the login page.
    };

    // While we are checking if the user is logged in, show a full-page spinner.
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    // This is the main layout, which will only be shown AFTER loading is false AND a session was found.
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">🛡️ Travel Shield</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/geofencing">{t('geofencingLink', 'Geofencing')}</Nav.Link>
                            <Nav.Link as={Link} to="/digital-id">{t('digitalIdLink', 'Digital ID')}</Nav.Link>
                            <Nav.Link as={Link} to="/about-us">{t('aboutUsLink', 'About Us')}</Nav.Link>
                        </Nav>
                        <Nav className="align-items-center ms-auto">
                            <LanguageSwitcher />
                            {profile ? (
                                <NavDropdown title={profile.full_name || t('accountLink', 'Account')} id="collasible-nav-dropdown" className="ms-2">
                                    <NavDropdown.Item as={Link} to="/my-account">{t('myAccountLink', 'My Account')}</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>{t('logoutButton', 'Logout')}</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                // This is a fallback for the brief moment before profile loads
                                <Spinner animation="border" variant="light" size="sm" className="ms-2" />
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