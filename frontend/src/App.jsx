import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);

  // This function calls your Python Backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Run this function as soon as the page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Fitness Portal: Member List</h1>
      <hr />
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.username}</strong> - {user.email}
          </li>
        ))}
      </ul>
      {users.length === 0 && <p>No users found in database.</p>}
    </div>
  );
}

export default App;
