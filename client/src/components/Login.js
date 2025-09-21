import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Make sure Link is imported
import { useAuth } from '../context/authcontext';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

export default function Login() {
    const { login } = useAuth();
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
            await login(email, password);
            navigate('/'); // Redirect to the main dashboard after login
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <Row>
                <Col>
                    <Card className="p-4 shadow-sm" style={{ width: '25rem' }}>
                        <Card.Body>
                            <h2 className="text-center mb-4">Login</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="formEmail"><Form.Label>Email</Form.Label><Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required /></Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword"><Form.Label>Password</Form.Label><Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /></Form.Group>
                                <div className="d-grid mt-4"><Button variant="primary" size="lg" type="submit" disabled={loading}>{loading ? <Spinner as="span" animation="border" size="sm" /> : 'Login'}</Button></div>
                            </Form>
                            
                            {/* THIS IS THE MISSING PART THAT HAS BEEN ADDED BACK */}
                            <div className="mt-3 text-center">
                                <small>Don't have an account? <Link to="/signup">Sign Up</Link></small>
                            </div>
                            {/* ------------------------------------------- */}

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

