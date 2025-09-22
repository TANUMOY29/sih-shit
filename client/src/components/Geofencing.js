import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/authcontext';
import api from '../services/api';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import MapView from './MapView';

export default function Geofencing() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const intervalRef = useRef(null);

  const sendLocation = async () => {
    if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        setIsTracking(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            // This now calls your new backend endpoint
            await api.post('location', { latitude, longitude });
            setMessage(`Location updated successfully at ${new Date().toLocaleTimeString()}`);
        } catch (err) {
            setError(err.message);
            setIsTracking(false); // Stop tracking if there's an error
        }
    }, () => {
        setError('Unable to retrieve your location. Please grant permission.');
        setIsTracking(false);
    }, { enableHighAccuracy: true });
  };

  useEffect(() => {
    if (isTracking) {
      sendLocation(); // Send location immediately when tracking starts
      intervalRef.current = setInterval(sendLocation, 30000); // And every 30 seconds thereafter
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setMessage('Tracking stopped.');
      }
    }
    // This is a cleanup function that stops the timer if you navigate away
    return () => clearInterval(intervalRef.current);
  }, [isTracking]);

  if (!user) {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" />
        </div>
    );
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Geofencing Mode</Card.Title>
        <Card.Text>Turn on tracking to share your location with authorities in real-time.</Card.Text>
        <div className="mb-3">
            <Button 
                variant={isTracking ? "danger" : "success"}
                onClick={() => setIsTracking(!isTracking)}
            >
                {isTracking ? "Stop Tracking" : "Start Tracking"}
            </Button>
        </div>
        
        {message && <Alert variant="info" className="mt-3">{message}</Alert>}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        <MapView />
      </Card.Body>
    </Card>
  );
}