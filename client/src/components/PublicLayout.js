import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap'; // The fix is here
import LanguageSwitcher from './LanguageSwitcher';

export default function PublicLayout() {
    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">🛡️ Travel Shield</Navbar.Brand>
                    <Nav className="ms-auto">
                        <LanguageSwitcher />
                    </Nav>
                </Container>
            </Navbar>
            <Outlet />
        </div>
    );
}