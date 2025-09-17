import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // Import the hook

export default function SignUp() {
    const { t } = useTranslation(); // Initialize the hook
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);
    
    const [aadhar, setAadhar] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');

    const [generatedOtp, setGeneratedOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data, error } = await supabase.from('aadhar_records').select('phone_number').eq('aadhar_number', aadhar).single();
            if (error || !data) throw new Error(t('aadharNotFoundError'));
            
            setPhoneNumber(data.phone_number);
            const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(fakeOtp);
            alert(t('demoOtpAlert', { otp: fakeOtp })); // Translated alert
            setStep(2);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otpInput !== generatedOtp) {
            return setError(t('incorrectOtpError')); // Translated error
        }
        setError('');
        setStep(3);
    };

    const handleFinalSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (signUpError) throw signUpError;
            
            if (data.user) {
                 const { error: profileError } = await supabase.from('tourists').insert({
                    id: data.user.id,
                    full_name: fullName,
                    email: email,
                    dob: dob,
                    phone: phoneNumber,
                    aadhar_number: aadhar,
                    role: 'user'
                }).select();
                if (profileError) throw profileError;
            }

            alert(t('signupSuccessAlert')); // Translated alert
            navigate('/login');

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
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
                                <p className="text-muted">{t('createAccountTitle')}</p>
                            </div>
                            {error && <Alert variant="danger">{error}</Alert>}
                            
                            {step === 1 && (
                                <Form onSubmit={handleSendOtp}>
                                    <Form.Group className="mb-3" controlId="formAadhar"><Form.Label>{t('aadharNumberLabel')}</Form.Label><Form.Control type="text" placeholder={t('aadharPlaceholder')} value={aadhar} onChange={e => setAadhar(e.target.value)} required minLength="12" maxLength="12" /></Form.Group>
                                    <div className="d-grid mt-4"><Button variant="primary" size="lg" type="submit" disabled={loading}>{loading ? <Spinner as="span" animation="border" size="sm" /> : t('sendOtpButton')}</Button></div>
                                </Form>
                            )}

                            {step === 2 && (
                                <Form onSubmit={handleVerifyOtp}>
                                    <p>{t('otpGeneratedMessage')}</p>
                                    <Form.Group className="mb-3" controlId="formOtp"><Form.Label>{t('otpLabel')}</Form.Label><Form.Control type="text" placeholder={t('otpPlaceholder')} value={otpInput} onChange={e => setOtpInput(e.target.value)} required minLength="6" maxLength="6" /></Form.Group>
                                    <div className="d-grid mt-4"><Button variant="success" size="lg" type="submit">{t('verifyOtpButton')}</Button></div>
                                </Form>
                            )}

                            {step === 3 && (
                                <Form onSubmit={handleFinalSignUp}>
                                    <p className="text-success">{t('aadharVerified')}</p>
                                    <hr/>
                                    <Form.Group className="mb-3" controlId="formFullName"><Form.Label>{t('fullNameLabel')}</Form.Label><Form.Control type="text" placeholder={t('fullNamePlaceholder')} value={fullName} onChange={e => setFullName(e.target.value)} required /></Form.Group>
                                    <Form.Group className="mb-3" controlId="formEmail"><Form.Label>{t('emailLabel')}</Form.Label><Form.Control type="email" placeholder={t('emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required /></Form.Group>
                                    <Form.Group className="mb-3" controlId="formPassword"><Form.Label>{t('passwordLabel')}</Form.Label><Form.Control type="password" placeholder={t('passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} required /></Form.Group>
                                    <Form.Group className="mb-3" controlId="formDob"><Form.Label>{t('dobLabel')}</Form.Label><Form.Control type="date" value={dob} onChange={e => setDob(e.target.value)} required /></Form.Group>
                                    <div className="d-grid mt-4"><Button variant="primary" size="lg" type="submit" disabled={loading}>{loading ? <Spinner as="span" animation="border" size="sm" /> : t('completeSignUpButton')}</Button></div>
                                </Form>
                            )}
                            
                            <div className="mt-3 text-center">
                                <small>{t('alreadyHaveAccount')} <Link to="/login">{t('loginLink')}</Link></small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}