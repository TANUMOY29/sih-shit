import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';

export default function AppLayout() {
    const [profile, setProfile] = useState(null);
    const [session, setSession] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                // If a session exists, fetch the user's profile
                fetchProfile(session.user);
            }
        });

        // Listen for auth changes (login, logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user);
            } else {
                setProfile(null); // Clear profile on logout
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (user) => {
        try {
            const { data, error } = await supabase
                .from('tourists')
                .select('full_name, role')
                .eq('id', user.id)
                .single();
            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error.message);
        }
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            navigate('/login'); // Redirect to login page after logout
        }
    };

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">🛡️ Travel Shield</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                        <Nav className="align-items-center">
                            <LanguageSwitcher />
                            {session && profile && (
                                <NavDropdown title={profile.full_name || 'Account'} id="collasible-nav-dropdown" className="ms-2">
                                    <NavDropdown.Item as={Link} to="/my-account">My Account</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Outlet /> {/* This renders the actual page content */}
            </Container>
        </div>
    );
}