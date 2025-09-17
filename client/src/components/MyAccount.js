import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function MyAccount() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    // State for the form fields
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const getUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                
                const { data: profileData } = await supabase.from('tourists').select('*').eq('id', user.id).single();
                
                if (profileData) {
                    setFullName(profileData.full_name || '');
                    setDob(profileData.dob || '');
                    setGender(profileData.gender || '');
                    setAddress(profileData.address || '');
                    setAadhar(profileData.aadhar_number || '');
                    setEmail(profileData.email || user.email);
                } else {
                    setEmail(user.email); // Set email for new profiles
                }
            }
        };
        getUserData();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const updates = {
            id: user.id,
            updated_at: new Date(),
            full_name: fullName,
            dob: dob,
            gender: gender,
            address: address,
            // We will also update email and aadhar as requested
            email: email,
            aadhar_number: aadhar
        };

        try {
            const { error } = await supabase.from('tourists').upsert(updates);
            if (error) throw error;
            setMessage('Profile saved successfully!');
        } catch (error)  {
            setMessage('Error saving profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Card className="p-4 shadow-sm">
                <Card.Body>
                    <h2 className="text-center mb-4">{t('myAccountTitle', 'My Account')}</h2>
                    {message && <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>}
                    
                    <Form onSubmit={handleUpdateProfile}>
                        {/* THE FIX IS HERE: 'readOnly' and 'disabled' have been removed. */}
                        <Form.Group className="mb-3">
                            <Form.Label>{t('emailLabel')}</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('aadharNumberLabel')}</Form.Label>
                            <Form.Control type="text" value={aadhar} onChange={(e) => setAadhar(e.target.value)} />
                        </Form.Group>
                        
                        <hr/>
                        <p>Please enter your details below to update your profile.</p>

                        <Form.Group className="mb-3">
                            <Form.Label>{t('fullNameLabel')}</Form.Label>
                            <Form.Control type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('dobLabel')}</Form.Label>
                            <Form.Control type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('genderLabel', 'Gender')}</Form.Label>
                            <Form.Select value={gender} onChange={(e) => setGender(e.target.value)} required>
                                <option value="">{t('selectGender', 'Select Gender')}</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>{t('addressLabel', 'Address')}</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </Form.Group>

                        <div className="d-grid mt-4">
                            <Button variant="primary" size="lg" type="submit" disabled={!user || loading}>
                                {loading ? <Spinner as="span" animation="border" size="sm" /> : t('updateProfileButton', 'Update Profile')}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}