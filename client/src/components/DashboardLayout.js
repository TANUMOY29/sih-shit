import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// NOTE: All the duplicate imports have been removed and combined.

export default function DashboardLayout({ session }) {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/'); // Redirect to home page after sign out
    };

    return (
        <Container fluid>
            <Row>
                {/* Sidebar */}
                <Col md={3} lg={2} className="bg-light vh-100 p-3">
                    <h5 className="mb-3">Dashboard Menu</h5>
                    <Nav className="flex-column">
                        {/* NOTE: The extra </p> tags have been removed from each line below */}
                        <Nav.Link as={Link} to="/dashboard/account">My Account</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/geofencing">Geofencing & Map</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/digital-id">Digital ID</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard/about">About Us</Nav.Link>
                        <Nav.Link as="button" onClick={handleSignOut} className="btn btn-link text-start nav-link p-2">Sign Out</Nav.Link>
                    </Nav>
                </Col>

                {/* Main Content Area */}
                <Col md={9} lg={10} className="p-4">
                    {/* This Outlet is the magic part. It renders the correct section component. */}
                    <Outlet />
                </Col>
            </Row>
        </Container>
    );
}