import { useState, useEffect } from "react";
import Login from "./login";
import axios from "axios";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [users, setUsers] = useState([]);
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [myWorkouts, setMyWorkouts] = useState([]);

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      // We add 'Headers' to the request to carry our Token
      await axios.post(
        "http://127.0.0.1:8000/workouts/",
        {
          exercise_type: exercise,
          duration_minutes: parseInt(duration),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // This sends the VIP pass
          },
        },
      );
      alert("Workout Logged!");
      setExercise("");
      setDuration("");
    } catch (error) {
      console.error("Error logging workout", error);
      alert("Failed to log workout. Please login again.");
    }
    fetchMyWorkouts();
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchMyWorkouts();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const fetchMyWorkouts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/workouts/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching my workouts", error);
    }
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Fitness Portal: Member List</h1>
        <button
          onClick={handleLogout}
          style={{ height: "30px", marginTop: "50px", marginLeft: "50px" }}
        >
          Logout
        </button>
      </div>
      <hr />

      {/* 1. INPUT FORM */}
      <div
        style={{
          backgroundColor: "#73a69b",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h3>Log New Workout</h3>
        <form onSubmit={handleAddWorkout}>
          <input
            placeholder="Exercise (e.g. Running)"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <input
            placeholder="Minutes"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button
            type="submit"
            style={{ padding: "5px 15px", cursor: "pointer" }}
          >
            Add Workout
          </button>
        </form>
      </div>

      {/* 2. NEW: WORKOUT HISTORY TABLE */}
      <div style={{ marginBottom: "40px" }}>
        <h3>My Workout History</h3>
        {myWorkouts.length > 0 ? (
          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#d5b2ba" }}>
                <th>Exercise Type</th>
                <th>Duration (mins)</th>
              </tr>
            </thead>
            <tbody>
              {myWorkouts.map((w) => (
                <tr key={w.id}>
                  <td>{w.exercise_type}</td>
                  <td>{w.duration_minutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No workouts logged yet. Time to hit the gym!</p>
        )}
      </div>

      {/* 3. MEMBER LIST (ADMIN VIEW) */}
      <div style={{ marginTop: "20px", fontSize: "0.9em", color: "#666" }}>
        <h4>Registered Members:</h4>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.username}</strong> - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
