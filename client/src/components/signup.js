import { useState } from 'react';
// import { supabase } from '../supabaseClient'; // REMOVED THIS UNUSED IMPORT
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1); // 1 for Aadhar, 2 for OTP
    const [aadhar, setAadhar] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        // For the demo, we will log the OTP to the console.
        const demoOtp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`DEMO OTP for ${aadhar} is: ${demoOtp}`);
        setMessage(`An OTP has been sent (check the console).`);
        
        // In a real app, an Edge Function would be called here.
        // const { data, error } = await supabase.functions.invoke('send-otp', { ... });

        setStep(2); // Move to OTP step for the demo
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // In a real app, an Edge Function would be called here to verify and create the user.
        // const { data, error } = await supabase.functions.invoke('verify-otp', { ... });
        
        // For the demo, we simulate success
        alert('DEMO: Signup successful! Please log in with your phone number.');
        navigate('/login'); // Redirect to login

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
                                <p className="text-muted">Sign Up with Aadhar</p>
                            </div>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {message && <Alert variant="info">{message}</Alert>}

                            {step === 1 ? (
                                <Form onSubmit={handleSendOtp}>
                                    <Form.Group className="mb-3" controlId="formAadhar">
                                        <Form.Label>Aadhar Number</Form.Label>
                                        <Form.Control type="text" placeholder="Enter your 12-digit Aadhar" value={aadhar} onChange={e => setAadhar(e.target.value)} required minLength="12" maxLength="12" />
                                    </Form.Group>
                                    <div className="d-grid mt-4">
                                        <Button variant="primary" size="lg" type="submit" disabled={loading}>
                                            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Send OTP'}
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <Form onSubmit={handleVerifyOtp}>
                                    <Form.Group className="mb-3" controlId="formOtp">
                                        <Form.Label>OTP</Form.Label>
                                        <Form.Control type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} required minLength="6" maxLength="6" />
                                    </Form.Group>
                                    <div className="d-grid mt-4">
                                        <Button variant="success" size="lg" type="submit" disabled={loading}>
                                            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Verify & Sign Up'}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                            <div className="mt-3 text-center">
                                <small>Already have an account? <Link to="/login">Login</Link></small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}