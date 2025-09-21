import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';

export default function MyAccount() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        dob: '',
        gender: '',
        address: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                gender: user.gender || '',
                address: user.address || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const updatedUser = await api.put('tourists/me', formData);
            setUser(updatedUser); // Update the global user state
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <Spinner animation="border" />;
    }

    return (
        <Container>
            <Card className="p-4 shadow-sm">
                <Card.Body>
                    <h2 className="text-center mb-4">My Account</h2>
                    {message && <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>}
                    <Form onSubmit={handleUpdateProfile}>
                        <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={user.email} disabled /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Aadhar Number</Form.Label><Form.Control type="text" value={user.aadhar_number} disabled /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Full Name</Form.Label><Form.Control type="text" name="full_name" value={formData.full_name} onChange={handleChange} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Date of Birth</Form.Label><Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Gender</Form.Label><Form.Control type="text" name="gender" value={formData.gender} onChange={handleChange} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Address</Form.Label><Form.Control as="textarea" rows={3} name="address" value={formData.address} onChange={handleChange} /></Form.Group>
                        <div className="d-grid mt-4"><Button variant="primary" type="submit" disabled={loading}>{loading ? <Spinner as="span" animation="border" size="sm" /> : 'Update Profile'}</Button></div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}