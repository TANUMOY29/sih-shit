import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Button, Navbar, Nav, Container } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

export default function AppLayout() {
    const navigate = useNavigate();
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };
    return (
        <div>
            <Navbar bg="light" expand="lg" className="border-bottom shadow-sm">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/dashboard">🛡️ Travel Shield</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/dashboard/geofencing">Geofencing</Nav.Link>
                            <Nav.Link as={Link} to="/dashboard/digital-id">Digital ID</Nav.Link>
                            <Nav.Link as={Link} to="/dashboard/about">About Us</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link as={Link} to="/dashboard/account">My Account</Nav.Link>
                            <Button variant="outline-secondary" size="sm" onClick={handleSignOut}>Sign Out</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <main className="container mt-4">
                <Outlet />
            </main>
        </div>
    );
}