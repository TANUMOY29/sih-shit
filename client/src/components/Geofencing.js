import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import MapView from './MapView';
import { Card, Row, Col } from 'react-bootstrap';

export default function Geofencing({ session }) {
    const [isTracking, setIsTracking] = useState(false);
    const [trackingIntervalId, setTrackingIntervalId] = useState(null);

    // This function gets the user's location and saves it to Supabase
    const recordLocation = () => {
        if (!window.navigator.geolocation) {
            console.error('Geolocation is not supported by your browser.');
            return;
        }
        window.navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const { user } = session;
            console.log(`Recording location: ${latitude}, ${longitude}`);
            const { error } = await supabase.from('location_history').insert({
                tourist_id: user.id,
                latitude,
                longitude
            });
            if (error) {
                console.error("Error recording location:", error.message);
            }
        });
    };

    // THIS IS THE MISSING FUNCTION
    // It controls the start/stop logic when the button is clicked
    const handleTrackingToggle = () => {
        if (isTracking) {
            // If we are currently tracking, stop it
            clearInterval(trackingIntervalId);
            setTrackingIntervalId(null);
            setIsTracking(false);
            console.log("Stopped tracking.");
        } else {
            // If we are not tracking, start it
            recordLocation(); // Record location immediately
            const intervalId = setInterval(recordLocation, 30000); // Record every 30 seconds
            setTrackingIntervalId(intervalId);
            setIsTracking(true);
            console.log("Started tracking.");
        }
    };

    // This is a cleanup function to stop tracking if you navigate away from the page
    useEffect(() => {
        return () => {
            if (trackingIntervalId) {
                clearInterval(trackingIntervalId);
            }
        };
    }, [trackingIntervalId]);

    return (
        <div>
            <Row>
                <Col>
                    <Card className="p-4 mb-4 shadow-sm">
                        <Card.Body>
                            <h2>Geofencing Mode</h2>
                            <p className="text-muted">When turned on, your location will be periodically saved for your safety.</p>
                            <button onClick={handleTrackingToggle} className={`btn ${isTracking ? 'btn-success' : 'btn-secondary'}`}>
                                {isTracking ? 'Tracking ON' : 'Tracking OFF'}
                            </button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <MapView />
                </Col>
            </Row>
        </div>
    );
}