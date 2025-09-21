import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import SOSButton from './SOSButton'; // Assuming SOSButton is also updated

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
            <main className="container mt-4">
                {/* The content of your pages will be rendered here */}
            </main>
            {user && <SOSButton />}
        </div>
    );
}