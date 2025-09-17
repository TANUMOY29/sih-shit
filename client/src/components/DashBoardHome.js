import React from 'react';
import { supabase } from '../supabaseClient';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

export default function DashboardHome({ session }) {
    const handlePanicButtonClick = () => {
        if (!window.navigator.geolocation) {
            return alert('Geolocation is not supported by your browser.');
        }
        window.navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const { user } = session;
            const { error } = await supabase.from('alerts').insert({
                tourist_id: user.id, latitude, longitude, status: 'active'
            });
            if (error) {
                alert("SOS Error: " + error.message);
            } else {
                alert('SOS signal sent! Authorities have been notified.');
            }
        });
    };

    return (
        <Container className="text-center mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="p-5 border-0 shadow-lg">
                        <Card.Body>
                            <h2 className="mb-4 text-secondary">In case of emergency, press this button</h2>
                            <Button
                                variant="danger"
                                onClick={handlePanicButtonClick}
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '50%',
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                                    border: '5px solid white'
                                }}
                            >
                                SOS
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}