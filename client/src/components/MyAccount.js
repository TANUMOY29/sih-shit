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
    const [aadharNumber, setAadharNumber] = useState(''); // State for Aadhar
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { user } = session;
            // Fetch all profile data including the aadhar_number
            let { data, error } = await supabase.from('tourists').select('*').eq('id', user.id).single();

            if (error && error.code !== 'PGRST116') { // Ignore error if no row is found yet
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
                // Set the aadhar number from the fetched data
                setAadharNumber(data.aadhar_number || '');
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

        // Note: We are not updating the aadhar_number as it should be fixed upon signup.
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
    
    // Helper function to mask the Aadhar number
    const maskAadhar = (number) => {
        if (!number || number.length < 4) return 'Not Provided';
        return '********' + number.slice(-4);
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
                                    <Form.Group as={Col} controlId="email">
                                        <Form.Label>Email / Phone</Form.Label>
                                        <Form.Control type="text" value={session.user.email || session.user.phone} readOnly disabled />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="aadharNumber">
                                        <Form.Label>Aadhar Number</Form.Label>
                                        <Form.Control type="text" value={maskAadhar(aadharNumber)} readOnly disabled />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="fullName">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="documentNumber">
                                        <Form.Label>Other Document Number</Form.Label>
                                        <Form.Control type="text" name="documentNumber" value={profile.documentNumber} onChange={handleChange} />
                                    </Form.Group>
                                </Row>
                                <hr />
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