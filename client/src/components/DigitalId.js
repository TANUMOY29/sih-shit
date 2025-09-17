import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

export default function DigitalId({ session }) {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { user } = session;
            let { data, error } = await supabase.from('tourists').select('*').eq('id', user.id).single();

            if (error) console.warn(error);
            else if (data) {
                setProfile(data);
                checkIfActive(data.trip_start_date, data.trip_end_date);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [session]);

    const checkIfActive = (startDate, endDate) => {
        if (!startDate || !endDate) return setIsActive(false);
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        setIsActive(today >= start && today <= end);
    };

    const handleDateUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const { user } = session;
        
        const updates = {
            id: user.id,
            trip_start_date: profile.trip_start_date,
            trip_end_date: profile.trip_end_date,
            updated_at: new Date()
        };

        const { error } = await supabase.from('tourists').upsert(updates);

        if (error) {
            setMessage('Error setting trip dates: ' + error.message);
        } else {
            setMessage('Trip dates saved successfully!');
            checkIfActive(profile.trip_start_date, profile.trip_end_date);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    if (loading && !profile) return <p>Loading Digital ID...</p>;

    return (
        <Container>
            <Row>
                <Col md={7}>
                    <Card className="p-4">
                        <Card.Body>
                            <h2 className="mb-4">Activate Your Digital ID</h2>
                            <p>Your Digital ID is activated by setting your trip start and end dates. Your other credentials are automatically linked from your account.</p>
                            {message && <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>}
                            <Form onSubmit={handleDateUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name (from account)</Form.Label>
                                    <Form.Control type="text" value={profile?.full_name || ''} readOnly />
                                </Form.Group>
                                <Row>
                                    <Form.Group as={Col} controlId="trip_start_date">
                                        <Form.Label>Trip Start Date</Form.Label>
                                        <Form.Control type="date" name="trip_start_date" value={profile?.trip_start_date || ''} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="trip_end_date">
                                        <Form.Label>Trip End Date</Form.Label>
                                        <Form.Control type="date" name="trip_end_date" value={profile?.trip_end_date || ''} onChange={handleChange} />
                                    </Form.Group>
                                </Row>
                                <Button className="mt-3" variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Set Trip Dates & Activate ID'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={5}>
                    <Card className="text-center" style={{ border: isActive ? '3px solid #198754' : '3px solid #DC3545' }}>
                        <Card.Header as="h4" className={isActive ? 'bg-success text-white' : 'bg-danger text-white'}>
                            ID Status: {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Card.Title className="h5">{profile?.full_name}</Card.Title>
                            <Card.Text>
                                <strong>Unique ID:</strong><br/>
                                <small className="text-muted">{session.user.id}</small>
                                <hr/>
                                <strong>Trip Duration:</strong><br/>
                                {profile?.trip_start_date || 'N/A'} to {profile?.trip_end_date || 'N/A'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}