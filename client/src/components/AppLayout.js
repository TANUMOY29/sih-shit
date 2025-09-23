import { Link, useNavigate, Outlet } from 'react-router-dom'; // 1. Import Outlet
import { useAuth } from '../context/authcontext';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../context/TranslationContext';

import SOSButton from './SOSButton';

export default function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">Travel Shield</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/geofencing">{t('geofencing')}</Nav.Link>
                            <Nav.Link as={Link} to="/digital-id">{t('digitalID')}</Nav.Link>
                            <Nav.Link as={Link} to="/about-us">{t('aboutUs')}</Nav.Link>
                        </Nav>
                        <Nav>
                            <LanguageSwitcher />
                            {user && (
                                <NavDropdown title={user.full_name || 'Account'} id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/my-account">{t('myAccount')}</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>{t('logout')}</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            
            {/* 2. Add the Outlet component here */}
            <Container className="mt-4">
                <Outlet />
            </Container>
            
            {user && <SOSButton />}
        </div>
    );
}