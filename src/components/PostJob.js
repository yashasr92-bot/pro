import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
}

function PostJob() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wage, setWage] = useState("");
  const [location, setLocation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !wage || !location) {
      alert("Fill all fields + select location");
      return;
    }

    const res = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        wage,
        owner: user._id,
        location,
      }),
    });

    const data = await res.json();
    alert(data.message);
  };

  if (user.role !== "owner") return null;

  return (
    <div>
      <h2>Post Job</h2>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Wage" onChange={(e) => setWage(e.target.value)} />

      <h4>Click map to select location</h4>

      <MapContainer center={[12.97, 77.59]} zoom={13} style={{ height: "300px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker setLocation={setLocation} />
        {location && <Marker position={location} />}
      </MapContainer>

      <button onClick={handleSubmit}>Post Job</button>
    </div>
  );
}

export default PostJob;