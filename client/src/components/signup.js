import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import api from '../services/api';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

export default function SignUp() {
    const { register } = useAuth();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(0); // 0: Choice, 1: Aadhar, 2: OTP, 3: Profile
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [aadharNumber, setAadharNumber] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [password, setPassword] = useState('');

    const [aadharData, setAadharData] = useState(null);
    const [generatedOtp, setGeneratedOtp] = useState('');

   const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        // Send the correct field name
        const data = await api.post('aadhar/verify', { aadhar_number: aadharNumber.trim() });
        setAadharData(data);
        const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(fakeOtp);
        alert(`FOR DEMO PURPOSES, your OTP is: ${fakeOtp}`);
        setStep(2);
    } catch (err) {
        setError(err.response?.data?.msg || err.message);
    } finally {
        setLoading(false);
    }
};


    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otpInput !== generatedOtp) {
            return setError('Incorrect OTP. Please try again.');
        }
        setError('');
        setStep(3);
    };
    
    const handleFinalSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register({
                fullName: aadharData.full_name,
                email: aadharData.email,
                password: password,
                aadharNumber: aadharData.aadhar_number,
                dob: aadharData.dob,
                gender: aadharData.gender,
                address: aadharData.address
            });
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" onClick={() => setStep(1)}>Authenticate with Aadhar</Button>
                        <Button variant="secondary" size="lg" disabled>Authenticate with Other Docs (Coming Soon)</Button>
                    </div>
                );
            case 1:
                return (
                    <Form onSubmit={handleSendOtp}>
                        <Form.Group className="mb-3"><Form.Label>Aadhar Number</Form.Label><Form.Control type="text" value={aadharNumber} onChange={e => setAadharNumber(e.target.value)} required /></Form.Group>
                        <div className="d-grid"><Button variant="primary" type="submit" disabled={loading}>{loading ? <Spinner size="sm"/> : 'Send OTP'}</Button></div>
                    </Form>
                );
            case 2:
                return (
                    <Form onSubmit={handleVerifyOtp}>
                        <Form.Group className="mb-3"><Form.Label>OTP</Form.Label><Form.Control type="text" value={otpInput} onChange={e => setOtpInput(e.target.value)} required /></Form.Group>
                        <div className="d-grid"><Button variant="success" type="submit">Verify OTP</Button></div>
                    </Form>
                );
            case 3:
                return (
                    <Form onSubmit={handleFinalSignUp}>
                        <p className="text-success text-center">✓ Aadhar Verified!</p>
                        <Form.Group className="mb-3"><Form.Label>Full Name</Form.Label><Form.Control type="text" value={aadharData.full_name} disabled /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={aadharData.email} disabled /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Date of Birth</Form.Label><Form.Control type="text" value={new Date(aadharData.dob).toLocaleDateString()} disabled /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required /></Form.Group>
                        <div className="d-grid"><Button variant="primary" type="submit" disabled={loading}>{loading ? <Spinner size="sm"/> : 'Complete Registration'}</Button></div>
                    </Form>
                );
            default: return null;
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <Row>
                <Col>
                    <Card className="p-4 shadow-sm" style={{ width: '25rem' }}>
                        <Card.Body>
                            <h2 className="text-center mb-4">Create Your Account</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {renderStep()}
                             <div className="mt-3 text-center">
                                <small>Already have an account? <Link to="/login">Log In</Link></small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}