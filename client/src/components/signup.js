import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Aadhar, 2: OTP, 3: Profile Details
    
    // State for all form fields
    const [aadhar, setAadhar] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');

    // State to hold temporary data between steps
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const navigate = useNavigate();

    // Step 1: Send the OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data, error } = await supabase.from('aadhar_records').select('phone_number').eq('aadhar_number', aadhar).single();
            if (error || !data) throw new Error("This Aadhar number is not in our records.");
            
            setPhoneNumber(data.phone_number);
            const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(fakeOtp);
            alert(`FOR DEMO PURPOSES, your OTP is: ${fakeOtp}`);
            setStep(2);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify the OTP
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otpInput !== generatedOtp) {
            return setError("Incorrect OTP. Please try again.");
        }
        setError('');
        setStep(3); // Move to the final profile details step
    };

    // Step 3: Create the user with all details
    const handleFinalSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email, // Use email for login
                password: password,
                options: {
                    data: {
                        // This data will go into the 'users' table metadata and our 'tourists' table
                        full_name: fullName,
                        aadhar_number: aadhar,
                        dob: dob,
                        phone: phoneNumber, // Save the verified phone number
                        role: 'user'
                    }
                }
            });

            if (signUpError) throw signUpError;
            
            // We also need to insert into our public 'tourists' table
            if (data.user) {
                 const { error: profileError } = await supabase.from('tourists').insert({
                    id: data.user.id,
                    full_name: fullName,
                    email: email,
                    dob: dob,
                    phone: phoneNumber,
                    aadhar_number: aadhar,
                    role: 'user'
                });
                if (profileError) throw profileError;
            }

            alert('Signup successful! A confirmation link has been sent to your email. Please verify and then log in.');
            navigate('/login');

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to render the correct form based on the current step
    const renderFormStep = () => {
        switch (step) {
            case 1:
                return (
                    <Form onSubmit={handleSendOtp}>
                        <Form.Group className="mb-3" controlId="formAadhar"><Form.Label>Aadhar Number</Form.Label><Form.Control type="text" placeholder="Enter your 12-digit Aadhar" value={aadhar} onChange={e => setAadhar(e.target.value)} required minLength="12" maxLength="12" /></Form.Group>
                        <div className="d-grid mt-4"><Button variant="primary" size="lg" type="submit" disabled={loading}>{loading ? <Spinner as="span" animation="border" size="sm" /> : 'Send OTP'}</Button></div>
                    </Form>
                );
            case 2:
                return (
                    <Form onSubmit={handleVerifyOtp}>
                        <p>An OTP was generated for your Aadhar number. Please enter it below.</p>
                        <Form.Group className="mb-3" controlId="formOtp"><Form.Label>OTP</Form.Label><Form.Control type="text" placeholder="Enter 6-digit OTP" value={otpInput} onChange={e => setOtpInput(e.target.value)} required minLength="6" maxLength="6" /></Form.Group>
                        <div className="d-grid mt-4"><Button variant="success" size="lg" type="submit">Verify OTP</Button></div>
                    </Form>
                );
            case 3:
                return (
                    <Form onSubmit={handleFinalSignUp}>
                        <p className="text-success">✓ Aadhar Verified!</p>
                        <hr/>
                        <Form.Group className="mb-3" controlId="formFullName"><Form.Label>Full Name</Form.Label><Form.Control type="text" placeholder="Enter your full name" value={fullName} onChange={e => setFullName(e.target.value)} required /></Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail"><Form.Label>Email Address</Form.Label><Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required /></Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword"><Form.Label>Password</Form.Label><Form.Control type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required /></Form.Group>
                        <Form.Group className="mb-3" controlId="formDob"><Form.Label>Date of Birth</Form.Label><Form.Control type="date" value={dob} onChange={e => setDob(e.target.value)} required /></Form.Group>
                        <div className="d-grid mt-4"><Button variant="primary" size="lg" type="submit" disabled={loading}>{loading ? <Spinner as="span" animation="border" size="sm" /> : 'Complete Sign Up'}</Button></div>
                    </Form>
                );
            default:
                return null;
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <Row>
                <Col>
                    <Card className="p-4 shadow-sm" style={{ width: '25rem' }}>
                        <Card.Body>
                            <div className="text-center mb-4">
                                <h2>🛡️ Travel Shield</h2>
                                <p className="text-muted">Create Your Account</p>
                            </div>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {renderFormStep()}
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