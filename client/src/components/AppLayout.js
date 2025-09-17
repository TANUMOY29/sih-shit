import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Button, Navbar, Nav, Container } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import LanguageSwitcher from './LanguageSwitcher';

export default function AppLayout() {
    const navigate = useNavigate();
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };
    // Inside your AppLayout.js component...

return (
    <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">🛡️ Travel Shield</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center"> {/* Added align-items-center for better looks */}
                        
                        {/* THIS IS THE NEW PART */}
                        <LanguageSwitcher />
                        {/* END OF NEW PART */}

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