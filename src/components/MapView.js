import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState } from "react";

// 📍 Component to capture clicks
function LocationPicker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

function MapView({ jobs, setSelectedLocation, selectable }) {
  const [position, setPosition] = useState(null);

  return (
    <MapContainer
      center={[12.97, 77.59]}
      zoom={10}
      style={{ height: "400px", width: "100%", marginBottom: "20px" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 👨‍🌾 OWNER SELECT LOCATION */}
      {selectable && (
        <LocationPicker
          setPosition={(pos) => {
            setPosition(pos);
            setSelectedLocation(pos);
          }}
        />
      )}

      {/* Show selected marker */}
      {position && (
        <Marker position={position}>
          <Popup>Selected Location</Popup>
        </Marker>
      )}

      {/* Existing job markers */}
      {jobs.map((job) => (
        <Marker
          key={job._id}
          position={[
            job.location.coordinates[1],
            job.location.coordinates[0],
          ]}
        >
          <Popup>
            <h4>{job.title}</h4>
            <p>{job.description}</p>
            <p>₹ {job.wage}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;