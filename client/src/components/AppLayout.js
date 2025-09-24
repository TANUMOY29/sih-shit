import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../context/authcontext';
import { translate } from '../services/translationService';
import SOSButton from './SOSButton';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Language state for translation
  const [lang, setLang] = useState('en');
  const [labels, setLabels] = useState({
    geofencing: 'Geofencing',
    digitalID: 'Digital ID',
    aboutUs: 'About Us',
    myAccount: 'My Account',
    logout: 'Logout',
  });

  // Load translations when lang changes
  useEffect(() => {
    async function loadTranslations() {
      const geofencing = await translate('geofencing', lang);
      const digitalID = await translate('digitalID', lang);
      const aboutUs = await translate('aboutUs', lang);
      const myAccount = await translate('myAccount', lang);
      const logoutLabel = await translate('logout', lang);

      setLabels({
        geofencing,
        digitalID,
        aboutUs,
        myAccount,
        logout: logoutLabel,
      });
    }

    loadTranslations();
  }, [lang]);

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">Travel Shield</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/geofencing">{labels.geofencing}</Nav.Link>
              <Nav.Link as={Link} to="/digital-id">{labels.digitalID}</Nav.Link>
              <Nav.Link as={Link} to="/about-us">{labels.aboutUs}</Nav.Link>
            </Nav>
            <Nav>
              <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
              {user && (
                <NavDropdown title={user.full_name || 'Account'} id="collasible-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/my-account">{labels.myAccount}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>{labels.logout}</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Outlet />
      </Container>

      {user && <SOSButton />}
    </div>
  );
}
