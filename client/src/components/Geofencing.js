import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import MapView from './MapView';
import { useOutletContext } from 'react-router-dom';

export default function Geofencing() {
  // THE FIX IS HERE: We get the whole context first and check if it exists.
  const context = useOutletContext();
  const session = context?.session; // Safely access session using optional chaining

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const intervalRef = useRef(null);

  const sendLocationToSupabase = async () => {
    if (!session?.user) {
      console.log("No session, cannot send location.");
      return;
    }
    
    setMessage('Getting current location...');
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
        });
      });

      const { latitude, longitude } = position.coords;

      const { error } = await supabase
        .from('location_history')
        .insert({
          tourist_id: session.user.id,
          latitude: latitude,
          longitude: longitude
        });

      if (error) throw error;
      setMessage(`Location updated successfully at ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      setError(`Error: ${err.message}`);
      setIsTracking(false);
    }
  };

  useEffect(() => {
    if (isTracking) {
      sendLocationToSupabase();
      intervalRef.current = setInterval(sendLocationToSupabase, 30000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setMessage('Tracking stopped.');
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking, session]);

  const handleToggleTracking = () => {
    setIsTracking(!isTracking);
  };

  // Show a loading spinner until the context has been provided by the parent
  if (!context) {
    return (
        <div className="text-center">
            <Spinner animation="border" />
        </div>
    );
  }

  if (!session) {
    return <Alert variant="warning">You must be logged in to use this feature.</Alert>;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Geofencing Mode</Card.Title>
        <Card.Text>
          Turn on tracking to share your location in real-time.
        </Card.Text>
        <div className="mb-3">
            <Button 
                variant={isTracking ? "danger" : "success"}
                onClick={handleToggleTracking}
            >
                {isTracking ? "Stop Tracking" : "Start Tracking"}
            </Button>
        </div>
        
        {message && <Alert variant="info">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <MapView />
      </Card.Body>
    </Card>
  );
}