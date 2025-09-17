import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import MapView from './MapView'; // Assuming MapView is for displaying the map

export default function Geofencing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackingOn, setTrackingOn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        setError("You must be logged in to use this feature.");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleToggleTracking = () => {
    setTrackingOn(!trackingOn);
    // In a real application, you would start/stop sending GPS coordinates here.
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading Geofencing...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Geofencing Mode</Card.Title>
        <Card.Text>
          This page allows you to manage your safe zones and location tracking.
        </Card.Text>
        <div className="mb-3">
            <Button 
                variant={trackingOn ? "danger" : "success"}
                onClick={handleToggleTracking}
            >
                {trackingOn ? "Stop Tracking" : "Start Tracking"}
            </Button>
            {trackingOn && <span className="ms-3 text-success"><strong>Tracking is ON</strong></span>}
        </div>
        <MapView />
      </Card.Body>
    </Card>
  );
}