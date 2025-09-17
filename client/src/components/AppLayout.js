import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import SOSButton from './SOSButton'; // Import the new SOS Button

// This custom hook is the safe way to handle user sessions
const useUser = () => {
    const [session, setSession] = React.useState(null);
    const [profile, setProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchProfile = async (user) => {
            if (!user) return;
            try {
                const { data, error } = await supabase.from('tourists').select('full_name').eq('id', user.id).single();
                if (error && error.code !== 'PGRST116') throw error;
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error.message);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session) {
                await fetchProfile(session.user);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return { session, profile, loading };
};


export default function AppLayout() {
    const { t } = useTranslation();
    const { session, profile, loading } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    // If loading is done and there's still no session, redirect to login
    if (!session) {
        navigate('/login');
        return null; // Render nothing while redirecting
    }

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">Travel Shield</Navbar.Brand>
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
                                 <Spinner animation="border" variant="light" size="sm" className="ms-2" />
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Outlet />
            </Container>
            
            {/* The SOS button will now appear on all protected pages */}
            <SOSButton />
        </div>
    );
}