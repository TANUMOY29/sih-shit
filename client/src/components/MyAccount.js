import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';

export default function MyAccount() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                try {
                    const { data, error } = await supabase
                        .from('tourists')
                        .select('*')
                        .eq('id', user.id)
                        .single();
                    if (error) throw error;
                    setProfile(data);
                } catch (error) {
                    setError(error.message);
                }
            }
            setLoading(false);
        };
        
        fetchUserAndProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const updates = {
            id: user.id,
            full_name: profile.full_name,
            dob: profile.dob,
            // Add other fields you want to be updatable here
        };

        try {
            const { error } = await supabase.from('tourists').upsert(updates);
            if (error) throw error;
            setMessage('Profile updated successfully!');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <Container>
            <Card className="p-4 shadow-sm">
                <Card.Body>
                    <h2 className="text-center mb-4">My Account</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    
                    {profile && (
                        <Form onSubmit={handleUpdateProfile}>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type="email" value={profile.email || ''} disabled />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formFullName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={profile.full_name || ''}
                                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formDob">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control 
                                    type="date"
                                    value={profile.dob || ''}
                                    onChange={(e) => setProfile({...profile, dob: e.target.value})}
                                />
                            </Form.Group>
                            <div className="d-grid mt-4">
                                <Button variant="primary" size="lg" type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}