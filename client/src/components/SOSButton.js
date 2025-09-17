import React, { useState } from 'react';
import { Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';

export default function SOSButton() {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSOSClick = () => {
        setMessage(''); // Reset message for new alert
        setShowModal(true);
    };

    const handleConfirmSOS = async () => {
        setLoading(true);
        setMessage('');
        try {
            // 1. Get the current user's ID
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("You must be logged in to send an alert.");

            // 2. Get the user's current GPS location from the browser
            if (!navigator.geolocation) {
                throw new Error("Geolocation is not supported by your browser.");
            }

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                });
            });
            
            const { latitude, longitude } = position.coords;

            // 3. Create a new alert in the 'alerts' table
            // Note: The column in your screenshot is 'tourist_id', not 'user_id'
            const { error } = await supabase.from('alerts').insert({
                tourist_id: user.id, // Matching your table schema
                latitude: latitude,
                longitude: longitude,
                status: 'active'
            });

            if (error) throw error;

            setMessage("Success! Your location has been sent to the nearest authorities.");

        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        // Only close the modal if we are not in a loading state
        if (!loading) {
            setShowModal(false);
        }
    };

    const buttonStyle = {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        fontSize: '20px',
        fontWeight: 'bold',
        zIndex: 1050 // Make sure it's on top of other elements
    };

    return (
        <>
            <Button 
                variant="danger" 
                style={buttonStyle}
                onClick={handleSOSClick}
            >
                SOS
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm SOS Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to send an emergency alert? This will send your current GPS location to the authorities.</p>
                    {loading && <div className="text-center my-3"><Spinner animation="border" /></div>}
                    {message && <Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmSOS} disabled={loading || message.startsWith('Success')}>
                        Yes, I'm in Danger
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}