import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/authcontext';
import api from '../services/api';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
// import MapView from './MapView'; // Assuming you have a MapView component

export default function Geofencing() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const intervalRef = useRef(null);

  const sendLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            // NOTE: You need to build this '/location-history' endpoint on your backend
            await api.post('location-history', { latitude, longitude });
            setMessage(`Location updated at ${new Date().toLocaleTimeString()}`);
        } catch (err) {
            setError(err.message);
            setIsTracking(false); // Stop tracking on error
        }
    }, () => {
        setError('Unable to retrieve your location.');
        setIsTracking(false);
    });
  };

  useEffect(() => {
    if (isTracking) {
      sendLocation(); // Send location immediately
      intervalRef.current = setInterval(sendLocation, 30000); // And every 30 seconds
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current); // Cleanup on component unmount
  }, [isTracking]);

  if (!user) {
    return <Spinner animation="border" />;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Geofencing Mode</Card.Title>
        <Card.Text>Turn on tracking to share your location in real-time.</Card.Text>
        <Button variant={isTracking ? "danger" : "success"} onClick={() => setIsTracking(!isTracking)}>
          {isTracking ? "Stop Tracking" : "Start Tracking"}
        </Button>
        {message && <Alert variant="info" className="mt-3">{message}</Alert>}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {/* <MapView /> */}
      </Card.Body>
    </Card>
  );
}