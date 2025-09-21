import { Card, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/authcontext';

export default function DigitalId() {
    const { user } = useAuth();

    if (!user) {
        return <p>Loading Digital ID...</p>;
    }

    return (
        <Card style={{ width: '22rem', margin: 'auto' }} className="shadow">
            <Card.Header as="h5" className="text-center bg-primary text-white">
                Travel Shield Digital ID
            </Card.Header>
            <Card.Body>
                <Card.Title className="text-center">{user.full_name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-center">{user.email}</Card.Subtitle>
                <hr />
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <strong>Aadhar Number:</strong> {user.aadhar_number}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Gender:</strong> {user.gender}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Address:</strong> {user.address}
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
            <Card.Footer className="text-muted text-center">
                <small>This ID is for verification purposes only.</small>
            </Card.Footer>
        </Card>
    );
}