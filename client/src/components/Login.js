import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function Login() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            navigate('/');
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
                            <div className="text-center mb-4">
                                <h2>🛡️ Travel Shield</h2>
                                <p className="text-muted">{t('loginTitle')}</p>
                            </div>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>{t('emailLabel')}</Form.Label>
                                    <Form.Control type="email" placeholder={t('emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>{t('passwordLabel')}</Form.Label>
                                    <Form.Control type="password" placeholder={t('passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} required />
                                </Form.Group>
                                <div className="d-grid mt-4">
                                    <Button variant="primary" size="lg" type="submit" disabled={loading}>
                                        {loading ? <Spinner as="span" animation="border" size="sm" /> : t('loginButton')}
                                    </Button>
                                </div>
                            </Form>
                            <div className="mt-3 text-center">
                                <small>{t('noAccount')}<Link to="/signup">{t('signUpLink')}</Link></small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}