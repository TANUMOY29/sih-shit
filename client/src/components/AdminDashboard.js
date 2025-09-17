import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Container, Tabs, Tab, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ session }) {
    const [loading, setLoading] = useState(true);
    const [allTourists, setAllTourists] = useState([]);
    const [activeTourists, setActiveTourists] = useState([]);
    const [sosAlerts, setSosAlerts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        // Fetch all tourist registrations
        const { data: touristsData, error: touristsError } = await supabase.from('tourists').select('*');
        if (touristsError) console.error('Error fetching tourists:', touristsError);
        else {
            setAllTourists(touristsData);
            // Filter for active tourists
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const active = touristsData.filter(t => {
                if (!t.trip_start_date || !t.trip_end_date) return false;
                const start = new Date(t.trip_start_date);
                const end = new Date(t.trip_end_date);
                return today >= start && today <= end;
            });
            setActiveTourists(active);
        }

        // Fetch all SOS alerts and the name of the tourist who raised it
        const { data: alertsData, error: alertsError } = await supabase
            .from('alerts')
            .select('*, tourists(full_name, emergency_contact_phone)')
            .order('created_at', { ascending: false });

        if (alertsError) console.error('Error fetching alerts:', alertsError);
        else setSosAlerts(alertsData);

        setLoading(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const resolveAlert = async (alertId) => {
        const { error } = await supabase.from('alerts').update({ status: 'resolved' }).eq('id', alertId);
        if (error) {
            alert('Failed to resolve alert: ' + error.message);
        } else {
            alert('Alert marked as resolved.');
            fetchAllData(); // Refresh the list
        }
    };

    if (loading) return <p>Loading Admin Data...</p>;

    return (
        <Container fluid className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>🛡️ Admin Control Panel</h1>
                <Button variant="outline-secondary" onClick={handleSignOut}>Sign Out</Button>
            </div>
            
            <Tabs defaultActiveKey="registrations" id="admin-dashboard-tabs" className="mb-3">
                <Tab eventKey="registrations" title={`All Registrations (${allTourists.length})`}>
                    <Table striped bordered hover responsive>
                        <thead><tr><th>Name</th><th>Email (from Auth)</th><th>Home Country</th><th>Home Address</th></tr></thead>
                        <tbody>
                            {allTourists.map(t => <tr key={t.id}><td>{t.full_name}</td><td>{/* Email is in auth.users */}</td><td>{t.home_country}</td><td>{t.home_address}</td></tr>)}
                        </tbody>
                    </Table>
                </Tab>

                <Tab eventKey="active" title={`Active IDs (${activeTourists.length})`}>
                    <Table striped bordered hover responsive>
                        <thead><tr><th>Name</th><th>Trip Start</th><th>Trip End</th></tr></thead>
                        <tbody>
                            {activeTourists.map(t => <tr key={t.id}><td>{t.full_name}</td><td>{t.trip_start_date}</td><td>{t.trip_end_date}</td></tr>)}
                        </tbody>
                    </Table>
                </Tab>

                <Tab eventKey="sos" title={<span className="text-danger fw-bold">{`SOS Alerts (${sosAlerts.filter(a => a.status === 'active').length})`}</span>}>
                    {sosAlerts.filter(a => a.status === 'active').length === 0 ? <Alert variant="success">No active SOS alerts. All clear!</Alert> :
                    <Table striped bordered hover responsive variant="danger">
                        <thead><tr><th>Tourist Name</th><th>Location (Lat, Lng)</th><th>Status</th><th>Time</th><th>Emergency Contact</th><th>Action</th></tr></thead>
                        <tbody>
                            {sosAlerts.map(a => (
                                <tr key={a.id} style={{backgroundColor: a.status === 'resolved' ? '#d1e7dd' : ''}}>
                                    <td>{a.tourists?.full_name || 'N/A'}</td>
                                    <td><a href={`https://www.google.com/maps?q=${a.latitude},${a.longitude}`} target="_blank" rel="noopener noreferrer">{a.latitude}, {a.longitude}</a></td>
                                    <td>{a.status}</td>
                                    <td>{new Date(a.created_at).toLocaleString()}</td>
                                    <td>{a.tourists?.emergency_contact_phone || 'N/A'}</td>
                                    <td>{a.status === 'active' && <Button size="sm" variant="warning" onClick={() => resolveAlert(a.id)}>Mark as Resolved</Button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>}
                </Tab>
            </Tabs>
        </Container>
    );
}