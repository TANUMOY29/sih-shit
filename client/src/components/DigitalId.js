import React, { useState, useRef } from 'react';
import { useAuth } from '../context/authcontext';
import { Card, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import IdCard from './IdCard'; // Import our new visual component

const busStops = ["Howrah Station", "Esplanade", "Park Street", "Gariahat", "Salt Lake Sector V", "Airport"];
const durations = [
    { label: "2 Hour", value: 2 }, { label: "4 Hours", value: 4 },
    { label: "6 Hours", value: 6 }, { label: "8 Hours", value: 8 },
    { label: "10 Hours", value: 10 },{ label: "12 Hours", value: 12 },
    { label: "14 Hours", value: 14 },{ label: "16 Hours", value: 16 }
];

export default function DigitalId() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [startStop, setStartStop] = useState(busStops[0]);
    const [endStop, setEndStop] = useState(busStops[1]);
    const [duration, setDuration] = useState(durations[0].value);
    const [stops, setStops] = useState('');

    // A ref to hold a reference to the ID card's DOM element
    const idCardRef = useRef(null);

    const handleGenerateAndDownload = async () => {
        setLoading(true);
        setError('');
        try {
            // Wait for the IdCard component to render with the correct data
            await new Promise(resolve => setTimeout(resolve, 50));

            const element = idCardRef.current;
            if (!element) throw new Error("Could not find the ID card element.");
            
            const canvas = await html2canvas(element);
            const dataUrl = canvas.toDataURL('image/png');

            // Create a link to trigger the download
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `TravelShield_ID_${user.full_name.replace(' ', '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Create the data object for the ID card
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + duration);
    const idData = user ? {
        name: user.full_name,
        uid: user._id, // MongoDB uses _id
        aadhar: user.aadhar_number,
        start: startStop,
        end: endStop,
        stops: stops || 'N/A',
        expires: expirationTime.toLocaleString('en-IN')
    } : null;

    if (!user) {
        return <Spinner animation="border" />;
    }

    return (
        <Row>
            <Col md={6}>
                <Card className="p-4 shadow-sm">
                    <Card.Body>
                        <Card.Title><h2>Generate Your Digital Pass</h2></Card.Title>
                        <p>Your details are pre-filled. Select your journey to generate a temporary, downloadable pass with a QR code.</p>
                        <Form>
                            <Row>
                                <Col><Form.Group className="mb-3"><Form.Label>Starting Point</Form.Label><Form.Select value={startStop} onChange={(e) => setStartStop(e.target.value)}>{busStops.map(s => <option key={s}>{s}</option>)}</Form.Select></Form.Group></Col>
                                <Col><Form.Group className="mb-3"><Form.Label>Destination</Form.Label><Form.Select value={endStop} onChange={(e) => setEndStop(e.target.value)}>{busStops.map(s => <option key={s}>{s}</option>)}</Form.Select></Form.Group></Col>
                            </Row>
                            <Form.Group className="mb-3"><Form.Label>Stops in Between (optional)</Form.Label><Form.Control type="text" placeholder="e.g., Sealdah, Shyambazar" value={stops} onChange={(e) => setStops(e.target.value)} /></Form.Group>
                            <Form.Group className="mb-3"><Form.Label>Active Duration</Form.Label><Form.Select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}>{durations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}</Form.Select></Form.Group>
                            
                            {error && <Alert variant="danger">{error}</Alert>}

                            <div className="d-grid mt-4">
                                <Button variant="primary" size="lg" onClick={handleGenerateAndDownload} disabled={loading}>
                                    {loading ? <Spinner as="span" size="sm" /> : 'Generate & Download ID'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={6}>
                {/* This is the hidden card that we will "screenshot" */}
                <div ref={idCardRef}>
                    <IdCard idData={idData} />
                </div>
            </Col>
        </Row>
    );
}