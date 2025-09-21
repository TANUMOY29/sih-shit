import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Failed to log in');
            }

            localStorage.setItem('token', data.token);
            navigate('/');

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Log In</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleLogin}>
                            <Form.Group id="email"><Form.Label>Email</Form.Label><Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required /></Form.Group>
                            <Form.Group id="password"><Form.Label>Password</Form.Label><Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required /></Form.Group>
                            <Button disabled={loading} className="w-100 mt-3" type="submit">Log In</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
}