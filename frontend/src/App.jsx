import { useState, useEffect } from "react";
import Login from "./login";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

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

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm("Are you sure you want to remove this workout?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/workouts/${workoutId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Refresh the list after deleting
        fetchMyWorkouts();
      } catch (error) {
        console.error("Error deleting workout:", error);
        alert("Could not delete the workout.");
      }
    }
  };

  // This groups your workouts by type so the chart can read them
  const chartData = myWorkouts.reduce((acc, current) => {
    const existing = acc.find((item) => item.name === current.exercise_type);
    if (existing) {
      existing.value += current.duration_minutes;
    } else {
      acc.push({
        name: current.exercise_type,
        value: current.duration_minutes,
      });
    }
    return acc;
  }, []);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#fdfbf9",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: "#556b2f", margin: 0 }}>Fitness Portal</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 20px",
            backgroundColor: "#f2d7d5",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            color: "#7b241c",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      <hr
        style={{
          border: "0",
          height: "1px",
          backgroundColor: "#e0e0e0",
          marginBottom: "30px",
        }}
      />

      {/* 1. INPUT FORM */}
      <div
        style={{
          backgroundColor: "#e8f3f1",
          padding: "25px",
          borderRadius: "15px",
          marginBottom: "30px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          <div
            style={{
              flex: 1,
              backgroundColor: "#fef9e7",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
              border: "1px solid #f9e79f",
            }}
          >
            <h4 style={{ margin: 0, color: "#9a7d0a" }}>Total Workouts</h4>
            <p style={{ fontSize: "2em", margin: "10px 0", color: "#7d6608" }}>
              {myWorkouts.length}
            </p>
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: "#ebf5fb",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
              border: "1px solid #d6eaf8",
            }}
          >
            <h4 style={{ margin: 0, color: "#2e86c1" }}>Total Minutes</h4>
            <p style={{ fontSize: "2em", margin: "10px 0", color: "#21618c" }}>
              {myWorkouts.reduce((sum, w) => sum + w.duration_minutes, 0)}
            </p>
          </div>
        </div>
        <h3 style={{ color: "#4a7c74", marginTop: 0 }}>Log New Workout</h3>
        <form
          onSubmit={handleAddWorkout}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <input
            placeholder="Exercise (e.g. Yoga)"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            style={{
              flex: "1",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #c8dcd9",
              outline: "none",
            }}
          />
          <input
            placeholder="Minutes"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{
              width: "120px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #c8dcd9",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 25px",
              backgroundColor: "#73a69b",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Save Workout
          </button>
        </form>
      </div>

      {/* WORKOUT DISTRIBUTION CHART */}
      {myWorkouts.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "30px",
            border: "1px solid #f2f2f2",
            height: "350px",
            width: "100%", // Ensure a defined width
          }}
        >
          <h3 style={{ color: "#5d6d7e", marginTop: 0 }}>
            Activity Distribution (mins)
          </h3>
          <ResponsiveContainer width="99%" height="90%">
            {/* Changing to 99% often prevents the calculation loop error */}
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#93d790", "#8098b9", "#beb085", "#daaaa7", "#a78cb5"][
                        index % 5
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 2. WORKOUT HISTORY  */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ color: "#5d6d7e" }}>My Journey</h3>
        {myWorkouts.length > 0 ? (
          <div
            style={{
              borderRadius: "15px",
              overflow: "hidden",
              border: "1px solid #d6eaf8",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                backgroundColor: "white",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#ebf5fb", color: "#2e86c1" }}>
                  <th style={{ padding: "15px" }}>Activity</th>
                  <th style={{ padding: "15px" }}>Time Spent</th>
                  <th style={{ padding: "15px" }}>Action</th> {/* New Header */}
                </tr>
              </thead>
              <tbody>
                {myWorkouts.map((w) => (
                  <tr key={w.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                    <td style={{ padding: "15px", color: "#444" }}>
                      {w.exercise_type}
                    </td>
                    <td style={{ padding: "15px", color: "#444" }}>
                      {w.duration_minutes} mins
                    </td>
                    <td style={{ padding: "15px" }}>
                      <button
                        onClick={() => handleDeleteWorkout(w.id)}
                        style={{
                          backgroundColor: "#f9ebea",
                          color: "#c0392b",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "0.8em",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: "#999", fontStyle: "italic" }}>
            Your history is a blank canvas. Start moving!
          </p>
        )}
      </div>

      {/* 3. MEMBER LIST  */}
      <div
        style={{
          marginTop: "50px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
        }}
      >
        <h4 style={{ color: "#888", marginBottom: "10px" }}>
          Community Members
        </h4>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {users.map((user) => (
            <span
              key={user.id}
              style={{
                fontSize: "0.85em",
                backgroundColor: "#eee",
                padding: "5px 12px",
                borderRadius: "15px",
                color: "#666",
              }}
            >
              {user.username}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
