import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import api from '../services/api';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

export default function SignUp() {
    const { register } = useAuth();
    const navigate = useNavigate();
    
    // State to manage the signup flow
    const [step, setStep] = useState('choice'); // 'choice', 'aadharInput', 'otpInput', 'profileConfirm'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State for user data
    const [aadharNumber, setAadharNumber] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [prefilledData, setPrefilledData] = useState(null);
    const [password, setPassword] = useState('');

    const handleAadharAuth = async () => {
        setLoading(true);
        setError('');
        try {
            // Step 1: Find the Aadhar record in our demo DB
            const record = await api.get(`aadhar/${aadharNumber}`);
            setPrefilledData(record);

            // Step 2: Simulate sending OTP
            const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(fakeOtp);
            alert(`FOR DEMO: OTP for ${record.phone_number} is ${fakeOtp}`);
            
            setStep('otpInput');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = () => {
        if (otpInput === generatedOtp) {
            setStep('profileConfirm');
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    const handleFinalRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Use the pre-filled data and the new password to register the user
            await register({
                fullName: prefilledData.full_name,
                email: prefilledData.email,
                password: password,
                aadharNumber: prefilledData.aadhar_number,
                dob: prefilledData.dob,
                gender: prefilledData.gender,
                address: prefilledData.address
            });
            navigate('/'); // Redirect to dashboard
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'aadharInput':
                return (
                    <Form.Group>
                        <Form.Label>Aadhar Number</Form.Label>
                        <Form.Control type="text" value={aadharNumber} onChange={e => setAadharNumber(e.target.value)} placeholder="Enter 12-digit Aadhar" />
                        <Button onClick={handleAadharAuth} className="w-100 mt-3" disabled={loading}>{loading ? <Spinner size="sm" /> : "Verify Aadhar"}</Button>
                    </Form.Group>
                );
            case 'otpInput':
                return (
                    <Form.Group>
                        <Form.Label>Enter OTP</Form.Label>
                        <Form.Control type="text" value={otpInput} onChange={e => setOtpInput(e.target.value)} placeholder="6-digit OTP" />
                        <Button onClick={handleOtpVerify} className="w-100 mt-3">Verify OTP</Button>
                    </Form.Group>
                );
            case 'profileConfirm':
                return (
                    <Form onSubmit={handleFinalRegister}>
                        <h4 className="text-success text-center">Aadhar Verified!</h4>
                        <p className="text-muted text-center">Please confirm your details and set a password.</p>
                        <Form.Group className="mb-2"><Form.Label>Full Name</Form.Label><Form.Control type="text" value={prefilledData.full_name} disabled /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Email</Form.Label><Form.Control type="email" value={prefilledData.email} disabled /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Date of Birth</Form.Label><Form.Control type="text" value={new Date(prefilledData.dob).toLocaleDateString()} disabled /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required /></Form.Group>
                        <Button type="submit" className="w-100" disabled={loading}>{loading ? <Spinner size="sm" /> : "Complete Registration"}</Button>
                    </Form>
                );
            case 'choice':
            default:
                return (
                    <div>
                        <Button onClick={() => setStep('aadharInput')} className="w-100 mb-3" size="lg">Authenticate with Aadhar</Button>
                        <Button variant="secondary" className="w-100" size="lg" disabled>Authenticate with Other Docs</Button>
                    </div>
                );
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Register</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {renderStep()}
                        <div className="w-100 text-center mt-2">
                            <Link to="/login">Already have an account? Log In</Link>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
}
