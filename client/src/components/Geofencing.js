import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import MapView from './MapView';

export default function Geofencing() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackingOn, setTrackingOn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be logged in to use this feature.");
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="text-center"><Spinner animation="border" /><p>Loading Geofencing...</p></div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Geofencing Mode</Card.Title>
        <Card.Text>This page allows you to manage your safe zones and location tracking.</Card.Text>
        <div className="mb-3">
            <Button variant={trackingOn ? "danger" : "success"} onClick={() => setTrackingOn(!trackingOn)}>
                {trackingOn ? "Stop Tracking" : "Start Tracking"}
            </Button>
            {trackingOn && <span className="ms-3 text-success"><strong>Tracking is ON</strong></span>}
        </div>
        <MapView />
      </Card.Body>
    </Card>
  );
}