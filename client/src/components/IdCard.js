import React from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
// THE FIX (Part 1): Change the import to a named import for QRCodeSVG
import { QRCodeSVG } from 'qrcode.react';

// This is the visual component for your ID Card
export default function IdCard({ idData }) {
    if (!idData) return null;

    const qrCodeData = JSON.stringify({
        name: idData.name,
        uid: idData.uid,
        aadhar: idData.aadhar,
        from: idData.start,
        to: idData.end,
        expires: idData.expires,
    });

    return (
        <Card style={{ width: '24rem', border: '2px solid #007bff' }} className="shadow">
            <Card.Header className="bg-primary text-white text-center">
                <h4>🛡️ Travel Shield - Digital Pass</h4>
            </Card.Header>
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={4} className="text-center">
                        <Image src="https://placehold.co/100x120/EFEFEF/AAAAAA?text=Photo" thumbnail />
                    </Col>
                    <Col xs={8}>
                        <h5 className="mb-1">{idData.name}</h5>
                        <p className="text-muted mb-1"><small>UID: {idData.uid}</small></p>
                        <p className="mb-0"><small>Aadhar: **** **** {idData.aadhar?.slice(-4)}</small></p>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col xs={8}>
                        <p className="mb-1"><strong>From:</strong> {idData.start}</p>
                        <p className="mb-1"><strong>To:</strong> {idData.end}</p>
                        <p className="mb-1"><strong>Stops:</strong> {idData.stops}</p>
                        <p className="text-danger mb-0"><strong>Expires: {idData.expires}</strong></p>
                    </Col>
                    <Col xs={4} className="d-flex align-items-center justify-content-center">
                        {/* THE FIX (Part 2): Use the imported QRCodeSVG component */}
                        <QRCodeSVG value={qrCodeData} size={80} />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}
