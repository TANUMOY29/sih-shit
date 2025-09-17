import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.error_description || error.message);
        } else {
            navigate('/dashboard'); // Navigate to the main dashboard after login
        }
        setLoading(false);
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <Row>
                <Col>
                    <Card className="p-4 shadow-sm" style={{ width: '25rem' }}>
                        <Card.Body>
                            <div className="text-center mb-4">
                                <h2>🛡️ Travel Shield</h2>
                                <p className="text-muted">Login to your account</p>
                            </div>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                                </Form.Group>
                                <div className="d-grid mt-4">
                                    <Button variant="primary" size="lg" type="submit" disabled={loading}>
                                        {loading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </div>
                                <div className="mt-3 text-center">
                                    <small>Don't have an account? <Link to="/signup">Sign Up</Link></small>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}