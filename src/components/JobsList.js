import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [nearbyMode, setNearbyMode] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // ======================
  // SOCKET + FETCH (FIXED)
  // ======================
  useEffect(() => {
    if (!user) return;

    socket.emit("join", user._id);

    const handler = (data) => {
      alert(data.message);
    };

    socket.on("notification", handler);

    fetch(
      `http://localhost:5000/api/jobs?userId=${user._id}&role=${user.role}`
    )
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setAllJobs(data);
      });

    return () => {
      socket.off("notification", handler);
    };
  }, [user?._id, user?.role]); // ✅ FIXED ESLINT

  // ======================
  // DISTANCE FUNCTION
  // ======================
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // ======================
  // TOGGLE NEARBY
  // ======================
  const toggleNearby = () => {
    if (!nearbyMode) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        const filtered = allJobs.filter((job) => {
          if (!job.location) return false;

          const dist = getDistance(
            userLat,
            userLng,
            job.location.lat,
            job.location.lng
          );

          return dist <= 10;
        });

        setJobs(filtered);
        setNearbyMode(true);
      });
    } else {
      setJobs(allJobs);
      setNearbyMode(false);
    }
  };

  // ======================
  // APPLY
  // ======================
  const applyJob = async (jobId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      const data = await res.json();
      alert(data.message);
      window.location.reload();
    } catch {
      alert("Error applying");
    }
  };

  // ======================
  // ACCEPT / REJECT
  // ======================
  const updateStatus = async (jobId, userId, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/applicant/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      alert(data.message);
      window.location.reload();
    } catch {
      alert("Error updating");
    }
  };

  // ======================
  // NAVIGATION
  // ======================
  const navigate = (job) => {
    if (!job.location) return alert("No location");

    navigator.geolocation.getCurrentPosition((pos) => {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${pos.coords.latitude},${pos.coords.longitude}&destination=${job.location.lat},${job.location.lng}`;
      window.open(url);
    });
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  // ======================
  // UI
  // ======================
  return (
    <div style={{ background: "#f4f6f8", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <div
        style={{
          background: "#2c3e50",
          color: "white",
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Job Portal</h2>

        <div>
          <button
            onClick={toggleNearby}
            style={{
              marginRight: "10px",
              background: nearbyMode ? "#27ae60" : "#3498db",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: "5px",
            }}
          >
            {nearbyMode ? "Show All Jobs" : "Nearby Jobs 📍"}
          </button>

          <button
            onClick={logout}
            style={{
              background: "#e74c3c",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: "5px",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* JOB LIST */}
      <div style={{ padding: "20px" }}>
        <h2>Jobs</h2>

        {jobs.length === 0 && <p>No jobs found</p>}

        {jobs.map((job) => (
          <div
            key={job._id}
            style={{
              background: "white",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>
              <b>₹ {job.wage}</b>
            </p>

            {/* WORKER */}
            {user.role === "worker" && (
              <>
                <button onClick={() => applyJob(job._id)}>Apply</button>
                <button onClick={() => navigate(job)}>Navigate</button>
              </>
            )}

            {/* OWNER */}
            {user.role === "owner" &&
              job.applicants?.map((a) => {
                if (!a.user) return null;

                return (
                  <div key={a.user._id}>
                    <p>
                      {a.user.name} - {a.status}
                    </p>

                    <button
                      onClick={() =>
                        updateStatus(job._id, a.user._id, "accepted")
                      }
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(job._id, a.user._id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobsList;