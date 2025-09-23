import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MapView from './MapView';
import { useTranslation } from '../context/TranslationContext';


export default function DashboardHome() {
    const { t } = useTranslation();

    return (
        <div>
            <h2 className="mb-4">{t('dashboardTitle')}</h2>
            <Row>
                <Col md={12} className="mb-4">
                    <MapView />
                </Col>
            </Row>
            <Row>
                <Col md={4} className="mb-4">
                    <Card as={Link} to="/my-account" className="text-decoration-none text-dark h-100">
                        <Card.Body>
                            <Card.Title>{t('myAccountLink')}</Card.Title>
                            <Card.Text>{t('myAccountDescription')}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card as={Link} to="/digital-id" className="text-decoration-none text-dark h-100">
                        <Card.Body>
                            <Card.Title>{t('digitalIdLink')}</Card.Title>
                            <Card.Text>{t('digitalIdDescription')}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card as={Link} to="/geofencing" className="text-decoration-none text-dark h-100">
                        <Card.Body>
                            <Card.Title>{t('geofencingLink')}</Card.Title>
                            <Card.Text>{t('geofencingDescription')}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}