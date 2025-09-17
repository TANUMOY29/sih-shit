import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [homeAddress, setHomeAddress] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            alert(error.error_description || error.message);
            setLoading(false);
            return;
        }

        const { error: profileError } = await supabase.from('tourists').insert({
            id: data.user.id,
            full_name: fullName,
            dob: dob ? dob : null,
            gender: gender,
            home_address: homeAddress
        });

        if (profileError) {
            alert("Auth successful, but failed to create profile: " + profileError.message);
        } else {
            alert('Signup successful! Please check your email to confirm.');
            navigate('/login');
        }
        setLoading(false);
    };
    
    return (
        <Container>
            {/* Make the container row take up more space: md={8} or lg={8} */}
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="p-4 my-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">Create Your Tourist Account</h2>
                            <Form onSubmit={handleSignUp}>
                                <Form.Group className="mb-3" controlId="formFullName">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter your full name" value={fullName} onChange={e => setFullName(e.target.value)} required />
                                </Form.Group>

                                {/* Use a Row to place the next two fields side-by-side */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                                    </Form.Group>
                                </Row>
                                
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formDob">
                                        <Form.Label>Date of Birth</Form.Label>
                                        <Form.Control type="date" value={dob} onChange={e => setDob(e.target.value)} />
                                    </Form.Group>
                                    
                                    <Form.Group as={Col} controlId="formGender">
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Control type="text" placeholder="e.g., Male, Female" value={gender} onChange={e => setGender(e.target.value)} />
                                    </Form.Group>
                                </Row>

                                <Form.Group className="mb-3" controlId="formAddress">
                                    <Form.Label>Home Address</Form.Label>
                                    <Form.Control type="text" placeholder="Your home address" value={homeAddress} onChange={e => setHomeAddress(e.target.value)} />
                                </Form.Group>

                                <div className="d-grid mt-4">
                                    <Button variant="primary" size="lg" type="submit" disabled={loading}>
                                        {loading ? 'Creating Account...' : 'Sign Up'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}