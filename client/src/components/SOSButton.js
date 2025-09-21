import { useState } from 'react';
import { Button, Modal, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api'; // Use our new api service

export default function SOSButton() {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSOSClick = () => {
        setMessage('');
        setShowModal(true);
    };

    const handleConfirmSOS = async () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // NOTE: You need to build this '/alerts' endpoint on your backend
                await api.post('alerts', { latitude, longitude });
                setMessage("Success! Your location has been sent to the nearest authorities.");
            } catch (err) {
                setMessage(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }, (err) => {
            setMessage(`Geolocation Error: ${err.message}`);
            setLoading(false);
        });
    };

    const handleCloseModal = () => setShowModal(false);

    const buttonStyle = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        fontSize: '24px',
        zIndex: 1000,
    };

    return (
        <>
            <Button variant="danger" style={buttonStyle} onClick={handleSOSClick}>
                SOS
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm SOS Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to send an emergency alert? This will send your current location to the authorities.</p>
                    {loading && <div className="text-center"><Spinner animation="border" /></div>}
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