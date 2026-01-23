import { useState, useEffect } from "react";
import Login from "./login";
import axios from "axios";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [users, setUsers] = useState([]);
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/workouts/", {
        exercise_type: exercise,
        duration_minutes: parseInt(duration),
      });
      alert("Workout Logged!");
      setExercise("");
      setDuration("");
    } catch (error) {
      console.error("Error logging workout", error);
    }
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
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
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
          style={{ height: "30px", marginTop: "25px" }}
        >
          Logout
        </button>
      </div>
      <hr />
      <div
        style={{
          backgroundColor: "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Log New Workout</h3>
        <form onSubmit={handleAddWorkout}>
          <input
            placeholder="Exercise (e.g. Running)"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          />
          <input
            placeholder="Minutes"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <button type="submit">Add Workout</button>
        </form>
      </div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.username}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
