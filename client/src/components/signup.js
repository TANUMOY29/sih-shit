import { useState } from 'react';
import { supabase } from '../supabaseClient';
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
        // In a real app, an Edge Function would send an SMS via Twilio.
        const demoOtp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`DEMO OTP for ${aadhar} is: ${demoOtp}`);
        setMessage(`An OTP has been sent (check the console).`);
        
        // You would replace the above with a call to a Supabase Edge Function
        // const { data, error } = await supabase.functions.invoke('send-otp', {
        //   body: { aadharNumber: aadhar },
        // });
        // if (error) setError(error.message);
        // else {
        //   setMessage('An OTP has been sent to the linked mobile number.');
        //   setStep(2);
        // }

        setStep(2); // Move to OTP step for the demo
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Here you would call an Edge Function to verify the OTP
        // and create the user on the backend.
        // const { data, error } = await supabase.functions.invoke('verify-otp', {
        //   body: { aadharNumber: aadhar, otpCode: otp },
        // });
        // if (error) setError(error.message);
        // else {
        //   alert('Signup successful! Please log in.');
        //   navigate('/login');
        // }
        
        // For the demo, we simulate success
        alert('DEMO: Signup successful! Please log in with your phone number.');
        navigate('/login'); // Redirect to login, which you'd also adapt for phone login

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
                                    <p>Enter the OTP sent to the mobile number linked with Aadhar ending in ...{/* You would show last 4 digits here */}</p>
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