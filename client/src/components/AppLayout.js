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
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            if (session) {
                await fetchProfile(session.user);
            }
            setLoading(false);
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (user) => {
        if (!user) return;
        try {
            const { data, error } = await supabase.from('tourists').select('full_name').eq('id', user.id).single();
            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error.message);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

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
                            {loading ? <Spinner animation="border" variant="light" size="sm" className="ms-2" /> : (
                                session && profile ? (
                                    <NavDropdown title={profile.full_name || t('accountLink', 'Account')} id="collasible-nav-dropdown" className="ms-2">
                                        <NavDropdown.Item as={Link} to="/my-account">{t('myAccountLink', 'My Account')}</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleLogout}>{t('logoutButton', 'Logout')}</NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    <Nav.Link as={Link} to="/login">{t('loginLink', 'Login')}</Nav.Link>
                                )
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