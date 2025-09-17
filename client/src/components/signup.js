import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1 for Aadhar, 2 for OTP
    const [aadhar, setAadhar] = useState('');
    const [otpInput, setOtpInput] = useState('');
    
    // We'll store the generated OTP and phone number in state
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Check if the Aadhar number exists in our records
            const { data, error } = await supabase
                .from('aadhar_records')
                .select('phone_number')
                .eq('aadhar_number', aadhar)
                .single();

            if (error || !data) {
                throw new Error("This Aadhar number is not in our records.");
            }
            
            // 2. If it exists, get the phone number and generate a fake OTP
            setPhoneNumber(data.phone_number);
            const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(fakeOtp);

            // 3. Show the OTP to the user for the demo
            alert(`FOR DEMO PURPOSES, your OTP is: ${fakeOtp}`);

            setStep(2); // Move to the OTP verification step

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // 1. Check if the entered OTP matches the one we generated
        if (otpInput !== generatedOtp) {
            setError("Incorrect OTP. Please try again.");
            setLoading(false);
            return;
        }

        try {
            // 2. If it matches, sign up the user with their phone number and a random password
            // (The user will use OTP to log in later, so this password doesn't matter)
            const randomPassword = Math.random().toString(36).slice(-8);
            const { error: signUpError } = await supabase.auth.signUp({
                phone: phoneNumber,
                password: randomPassword,
                options: {
                    data: {
                        aadhar_number: aadhar,
                        role: 'user' // Set the default role
                    }
                }
            });

            if (signUpError) throw signUpError;

            alert('Signup successful! Please proceed to login.');
            navigate('/login');

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            {/* The JSX for the form remains the same as the previous 'real' version */}
            <Row>
                <Col>
                    <Card className="p-4 shadow-sm" style={{ width: '25rem' }}>
                        <Card.Body>
                            <div className="text-center mb-4">
                                <h2>🛡️ Travel Shield</h2>
                                <p className="text-muted">Sign Up with Aadhar</p>
                            </div>
                            {error && <Alert variant="danger">{error}</Alert>}
                            
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
                                        <Form.Control type="text" placeholder="Enter 6-digit OTP" value={otpInput} onChange={e => setOtpInput(e.target.value)} required minLength="6" maxLength="6" />
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