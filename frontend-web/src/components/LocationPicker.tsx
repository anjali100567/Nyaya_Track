import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Crosshair, MapPin } from 'lucide-react';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const defaultCenter: L.LatLngTuple = [28.6139, 77.2090]; // New Delhi

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      const addr = data.display_name || "Unknown Location";
      setAddress(addr);
      onLocationSelect({ lat, lng, address: addr });
    } catch (e) {
      console.error("Geocoding failed", e);
      setAddress("Error fetching address");
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const LocationController = () => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.flyTo(position, 15);
      }
    }, [position, map]);

    return null;
  };

  const handleLocateMe = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const latlng = new L.LatLng(lat, lng);
          setPosition(latlng);
          reverseGeocode(lat, lng);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          alert("Could not fetch location. Please ensure location permissions are enabled.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="input-group">
        <label>Selected Address</label>
        <div className="search-loc" style={{ display: 'flex', gap: '10px' }}>
          <MapPin size={18} className="loc-icon"/>
          <input 
            type="text" 
            value={address} 
            placeholder="Click on the map or use GPS..." 
            readOnly 
            style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
          />
          <button 
            type="button"
            className="btn btn-outline" 
            onClick={handleLocateMe}
            disabled={loading}
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', minWidth: 'fit-content' }}
          >
            <Crosshair size={16} /> {loading ? 'Locating...' : 'Use GPS'}
          </button>
        </div>
      </div>
      
      <div style={{ height: '350px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <MapContainer center={defaultCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents />
          <LocationController />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;
