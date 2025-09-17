import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Card } from 'react-bootstrap'; // Import Card

// Make the map container take up more vertical space (65% of the viewport height)
const containerStyle = {
  width: '100%',
  height: '65vh'
};

const libraries = ['places'];

export default function MapView() {
    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 22.5726, lng: 88.3639 }); // Default to Kolkata
    const [nearbyPlaces, setNearbyPlaces] = useState([]);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries,
    });
    
    const findNearbyPoliceStations = () => {
        // ... (This function remains the same) ...
        if (!window.navigator.geolocation) {
            return alert('Geolocation is not supported.');
        }

        window.navigator.geolocation.getCurrentPosition(position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            setCenter(userLocation);

            if (map) {
                const service = new window.google.maps.places.PlacesService(map);
                const request = { location: userLocation, radius: '5000', type: ['police'] };
                service.nearbySearch(request, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setNearbyPlaces(results);
                    }
                });
            }
        });
    };

    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        // Wrap the map and button in a Card for consistent styling
        <Card className="shadow-sm">
            <Card.Body>
                <button className="btn btn-primary mb-3" onClick={findNearbyPoliceStations}>Find Nearest Police Stations</button>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={14}
                    onLoad={mapInstance => setMap(mapInstance)}
                >
                    <Marker position={center} />
                    {nearbyPlaces.map(place => (
                        <Marker key={place.place_id} position={place.geometry.location} title={place.name} />
                    ))}
                </GoogleMap>
            </Card.Body>
        </Card>
    );
}