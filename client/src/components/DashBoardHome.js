import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MapView from './MapView';
import { translate } from '../services/translationService';

export default function DashboardHome({ lang = 'en' }) {
  const [labels, setLabels] = useState({
    dashboardTitle: '',
    myAccountLink: '',
    myAccountDescription: '',
    digitalIdLink: '',
    digitalIdDescription: '',
    geofencingLink: '',
    geofencingDescription: '',
  });

  useEffect(() => {
    async function loadTranslations() {
      const dashboardTitle = await translate('dashboardTitle', lang);
      const myAccountLink = await translate('myAccountLink', lang);
      const myAccountDescription = await translate('myAccountDescription', lang);
      const digitalIdLink = await translate('digitalIdLink', lang);
      const digitalIdDescription = await translate('digitalIdDescription', lang);
      const geofencingLink = await translate('geofencingLink', lang);
      const geofencingDescription = await translate('geofencingDescription', lang);

      setLabels({
        dashboardTitle,
        myAccountLink,
        myAccountDescription,
        digitalIdLink,
        digitalIdDescription,
        geofencingLink,
        geofencingDescription,
      });
    }

    loadTranslations();
  }, [lang]);

  return (
    <div>
      <h2 className="mb-4">{labels.dashboardTitle}</h2>
      <Row>
        <Col md={12} className="mb-4">
          <MapView />
        </Col>
      </Row>
      <Row>
        <Col md={4} className="mb-4">
          <Card as={Link} to="/my-account" className="text-decoration-none text-dark h-100">
            <Card.Body>
              <Card.Title>{labels.myAccountLink}</Card.Title>
              <Card.Text>{labels.myAccountDescription}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card as={Link} to="/digital-id" className="text-decoration-none text-dark h-100">
            <Card.Body>
              <Card.Title>{labels.digitalIdLink}</Card.Title>
              <Card.Text>{labels.digitalIdDescription}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card as={Link} to="/geofencing" className="text-decoration-none text-dark h-100">
            <Card.Body>
              <Card.Title>{labels.geofencingLink}</Card.Title>
              <Card.Text>{labels.geofencingDescription}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
