import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

export default function MyAccount({ session }) {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        fullName: '', documentNumber: '', homeCountry: '',
        emergencyContactName: '', emergencyContactPhone: '',
        dob: '', gender: '', homeAddress: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { user } = session;
            let { data, error } = await supabase.from('tourists').select('*').eq('id', user.id).single();

            if (error && error.code !== 'PGRST116') {
                console.warn(error);
            } else if (data) {
                setProfile({
                    fullName: data.full_name || '',
                    documentNumber: data.document_number || '',
                    homeCountry: data.home_country || '',
                    emergencyContactName: data.emergency_contact_name || '',
                    emergencyContactPhone: data.emergency_contact_phone || '',
                    dob: data.dob || '',
                    gender: data.gender || '',
                    homeAddress: data.home_address || ''
                });
            }
            setLoading(false);
        };

        fetchProfile();
    }, [session]);

    const updateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const { user } = session;

        const updates = {
            id: user.id,
            full_name: profile.fullName,
            document_number: profile.documentNumber,
            home_country: profile.homeCountry,
            emergency_contact_name: profile.emergencyContactName,
            emergency_contact_phone: profile.emergencyContactPhone,
            dob: profile.dob ? profile.dob : null,
            gender: profile.gender,
            home_address: profile.homeAddress,
            updated_at: new Date(),
        };

        let { error } = await supabase.from('tourists').upsert(updates);

        if (error) {
            setMessage('Error updating profile: ' + error.message);
        } else {
            setMessage('Profile updated successfully!');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    if (loading) return <p>Loading your account details...</p>;

    return (
        <Container>
            <Row>
                <Col>
                    <Card className="p-4">
                        <Card.Body>
                            <h2 className="mb-4">My Account</h2>
                            {message && <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>}
                            <Form onSubmit={updateProfile}>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="fullName">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="documentNumber">
                                        <Form.Label>Document Number (Passport/Aadhaar)</Form.Label>
                                        <Form.Control type="text" name="documentNumber" value={profile.documentNumber} onChange={handleChange} />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="dob">
                                        <Form.Label>Date of Birth</Form.Label>
                                        <Form.Control type="date" name="dob" value={profile.dob} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="gender">
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Control type="text" name="gender" value={profile.gender} onChange={handleChange} />
                                    </Form.Group>
                                </Row>
                                <Form.Group className="mb-3" controlId="homeAddress">
                                    <Form.Label>Home Address</Form.Label>
                                    <Form.Control type="text" name="homeAddress" value={profile.homeAddress} onChange={handleChange} />
                                </Form.Group>
                                <hr />
                                <h4 className="mt-4">Emergency Contact</h4>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="emergencyContactName">
                                        <Form.Label>Contact Name</Form.Label>
                                        <Form.Control type="text" name="emergencyContactName" value={profile.emergencyContactName} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="emergencyContactPhone">
                                        <Form.Label>Contact Phone</Form.Label>
                                        <Form.Control type="text" name="emergencyContactPhone" value={profile.emergencyContactPhone} onChange={handleChange} />
                                    </Form.Group>
                                </Row>
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}