import { useEffect, useState } from "react";

function Notifications({ jobId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/jobs/${jobId}/notifications`)
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, [jobId]);

  return (
    <div style={styles.box}>
      <h3>🔔 Notifications</h3>

      {notifications.length === 0 && <p>No notifications</p>}

      {notifications.map((n, index) => (
        <div
          key={index}
          style={{
            ...styles.item,
            background: n.read ? "#eee" : "#d4edda",
          }}
        >
          <p>{n.message}</p>
          <small>{new Date(n.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

const styles = {
  box: {
    background: "white",
    padding: "10px",
    marginTop: "20px",
    borderRadius: "10px",
  },
  item: {
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "5px",
  },
};

export default Notifications;