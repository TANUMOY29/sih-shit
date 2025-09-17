import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function MyAccount() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUser(user);
                try {
                    // Fetch all fields now, including the new ones
                    const { data, error } = await supabase
                        .from('tourists')
                        .select('*')
                        .eq('id', user.id)
                        .single();
                    if (error) throw error;
                    setProfile(data);
                } catch (error) {
                    setError(error.message);
                }
            } else {
                setError("Could not find an active session. Please log in again.");
            }
            setLoading(false);
        };
        
        fetchUserAndProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const updates = {
            id: user.id,
            full_name: profile.full_name,
            dob: profile.dob,
            gender: profile.gender,
            address: profile.address,
        };

        try {
            const { error } = await supabase.from('tourists').upsert(updates);
            if (error) throw error;
            setMessage('Profile updated successfully!');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container>
            <Card className="p-4 shadow-sm">
                <Card.Body>
                    <h2 className="text-center mb-4">{t('myAccountTitle', 'My Account')}</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    
                    {profile && (
                        <Form onSubmit={handleUpdateProfile}>
                            <Form.Group className="mb-3"><Form.Label>{t('emailLabel')}</Form.Label><Form.Control type="email" value={profile.email || ''} disabled /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>{t('aadharNumberLabel')}</Form.Label><Form.Control type="text" value={profile.aadhar_number || ''} disabled /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>{t('fullNameLabel')}</Form.Label><Form.Control type="text" value={profile.full_name || ''} onChange={(e) => setProfile({...profile, full_name: e.target.value})} /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>{t('dobLabel')}</Form.Label><Form.Control type="date" value={profile.dob || ''} onChange={(e) => setProfile({...profile, dob: e.target.value})} /></Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>{t('genderLabel', 'Gender')}</Form.Label>
                                <Form.Select value={profile.gender || ''} onChange={(e) => setProfile({...profile, gender: e.target.value})}>
                                    <option value="">{t('selectGender', 'Select Gender')}</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>{t('addressLabel', 'Address')}</Form.Label>
                                <Form.Control as="textarea" rows={3} value={profile.address || ''} onChange={(e) => setProfile({...profile, address: e.target.value})} />
                            </Form.Group>

                            <div className="d-grid mt-4"><Button variant="primary" size="lg" type="submit" disabled={loading}>{loading ? t('updating', 'Updating...') : t('updateProfileButton', 'Update Profile')}</Button></div>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}