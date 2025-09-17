import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthoritiesDashboard() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        // Fetch alerts and join with the tourists table to get the name
        let { data, error } = await supabase
            .from('alerts')
            .select(`
                *,
                tourists ( full_name, emergency_contact_phone )
            `)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching alerts:', error);
        } else {
            setAlerts(data);
        }
        setLoading(false);
    };

    // BONUS: Realtime updates!
    useEffect(() => {
        const subscription = supabase.channel('alerts_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, payload => {
                console.log('Change received!', payload);
                fetchAlerts(); // Re-fetch alerts when a change occurs
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    if (loading) return <p>Loading active alerts...</p>;

    return (
        <div>
            <h1>Authorities Mission Control</h1>
            <h2>Active SOS Alerts</h2>
            {alerts.length === 0 ? <p>No active alerts.</p> : (
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Tourist Name</th>
                            <th>Emergency Contact</th>
                            <th>Location (Lat, Lng)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map(alert => (
                            <tr key={alert.id}>
                                <td>{new Date(alert.created_at).toLocaleString()}</td>
                                <td>{alert.tourists?.full_name || 'N/A'}</td>
                                <td>{alert.tourists?.emergency_contact_phone || 'N/A'}</td>
                                <td>{alert.latitude}, {alert.longitude}</td>
                                <td>{alert.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}