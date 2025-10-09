import React, { useState } from "react";

function App() {
  const [user, setUser] = useState(null); // Logged-in user
  const [role, setRole] = useState("student");
  const [studentName, setStudentName] = useState("");
  const [password, setPassword] = useState("");

  const [projects, setProjects] = useState([
    { id: 1, name: "AI Chatbot", feedback: [], ratings: [], members: [], progress: 50 },
    { id: 2, name: "Portfolio Website", feedback: [], ratings: [], members: [], progress: 70 },
  ]);

  const [announcements, setAnnouncements] = useState([
    "🚀 Welcome to Peer Review Week!",
    "🕓 Submit your project by Friday.",
  ]);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [newFeedback, setNewFeedback] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState("");

  // 🎓 Login Function
  const handleLogin = () => {
    if (studentName.trim() === "" || password.trim() === "") {
      alert("Please enter both name and password!");
      return;
    }
    setUser({ name: studentName, role });
  };

  // 🚪 Logout
  const handleLogout = () => {
    setUser(null);
    setStudentName("");
    setPassword("");
  };

  // 📢 Add Announcement (Admin)
  const handleAnnouncement = () => {
    if (newAnnouncement.trim()) {
      setAnnouncements([...announcements, newAnnouncement]);
      setNewAnnouncement("");
    }
  };

  // 🧠 Add Project (Admin)
  const handleAddProject = () => {
    const name = prompt("Enter project name:");
    if (name) {
      setProjects([
        ...projects,
        { id: Date.now(), name, feedback: [], ratings: [], members: [], progress: 0 },
      ]);
    }
  };

  // 📊 Update Progress (Admin)
  const handleProgress = (id) => {
    const newProgress = parseInt(prompt("Enter project progress % (0–100):"));
    if (!isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
      setProjects(
        projects.map((p) => (p.id === id ? { ...p, progress: newProgress } : p))
      );
    }
  };

  // 💬 Feedback (Student)
  const handleFeedback = (id) => {
    if (!newFeedback.trim()) return;
    setProjects(
      projects.map((p) =>
        p.id === id
          ? { ...p, feedback: [...p.feedback, `${user.name}: ${newFeedback}`] }
          : p
      )
    );
    setNewFeedback("");
  };

  // ⭐ Rate (Student)
  const handleRating = (id, stars) => {
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, ratings: [...p.ratings, stars] } : p
      )
    );
  };

  // 👥 Join Project (Student)
  const handleJoinProject = (id) => {
    setProjects(
      projects.map((p) =>
        p.id === id && !p.members.includes(user.name)
          ? { ...p, members: [...p.members, user.name] }
          : p
      )
    );
  };

  // 💭 Chat
  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, `${user.name}: ${chatInput}`]);
      setChatInput("");
    }
  };

  const avgRating = (r) =>
    r.length ? (r.reduce((a, b) => a + b, 0) / r.length).toFixed(1) : "No ratings yet";

  // 🧭 If not logged in — show Login Page
  if (!user)
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginBox}>
          <h1 style={{ color: "#fff" }}>🎓 Peer Review Platform</h1>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <input
            type="text"
            placeholder="Enter your name"
            style={styles.input}
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    );

  // 🧑‍🏫 Admin Dashboard
  if (user.role === "teacher")
    return (
      <div style={styles.teacherPage}>
        <div style={styles.navbar}>
          <h2>👩‍🏫 Teacher Dashboard</h2>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

        <div style={styles.card}>
          <h3>📢 Announcements</h3>
          <ul>
            {announcements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
          <input
            style={styles.input}
            placeholder="Add new announcement..."
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
          />
          <button style={styles.button} onClick={handleAnnouncement}>
            Post
          </button>
        </div>

        <div style={styles.card}>
          <h3>📊 Manage Projects</h3>
          <button style={styles.button} onClick={handleAddProject}>
            ➕ Add Project
          </button>
          {projects.map((p) => (
            <div key={p.id} style={styles.projectBox}>
              <strong>{p.name}</strong>
              <p>
                🧾 Feedbacks: {p.feedback.length} | ⭐ Avg Rating:{" "}
                {avgRating(p.ratings)} | 👥 Members: {p.members.length}
              </p>
              <p>Progress: {p.progress}%</p>
              <div style={styles.progressOuter}>
                <div
                  style={{ ...styles.progressInner, width: `${p.progress}%` }}
                />
              </div>
              <button
                style={styles.smallButton}
                onClick={() => handleProgress(p.id)}
              >
                ✏️ Update Progress
              </button>
            </div>
          ))}
        </div>
      </div>
    );

  // 👩‍🎓 Student Dashboard
  return (
    <div style={styles.studentPage}>
      <div style={styles.navbar}>
        <h2>👩‍🎓 Welcome, {user.name}</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.card}>
        <h3>🔔 Announcements</h3>
        <ul>
          {announcements.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      <div style={styles.card}>
        <h3>💻 Projects</h3>
        {projects.map((p) => (
          <div key={p.id} style={styles.projectBox}>
            <h4>{p.name}</h4>
            <p>👥 Members: {p.members.join(", ") || "None yet"}</p>
            <button style={styles.smallButton} onClick={() => handleJoinProject(p.id)}>
              Join
            </button>
            <p>⭐ Average Rating: {avgRating(p.ratings)}</p>

            <div>
              Rate:{" "}
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  style={{
                    cursor: "pointer",
                    color: p.ratings.includes(s) ? "gold" : "gray",
                    fontSize: "20px",
                  }}
                  onClick={() => handleRating(p.id, s)}
                >
                  ★
                </span>
              ))}
            </div>

            <input
              style={styles.input}
              placeholder="Write feedback..."
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
            />
            <button style={styles.smallButton} onClick={() => handleFeedback(p.id)}>
              Submit Feedback
            </button>

            <ul>
              {p.feedback.map((f, i) => (
                <li key={i}>💬 {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <h3>💬 Collaboration Chat</h3>
        <div style={styles.chatBox}>
          {chatMessages.map((m, i) => (
            <div key={i} style={styles.chatMessage}>
              {m}
            </div>
          ))}
        </div>
        <input
          style={styles.input}
          placeholder="Type message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
        <button style={styles.button} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

// 🎨 Styling
const styles = {
  loginPage: {
    height: "100vh",
    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBox: {
    background: "rgba(255, 255, 255, 0.15)",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    width: "80%",
    borderRadius: "8px",
    border: "none",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    marginBottom: "10px",
  },
  button: {
    background: "#007acc",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "red",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  teacherPage: {
    background: "linear-gradient(to right, #1e3c72, #2a5298)",
    minHeight: "100vh",
    color: "white",
    padding: "20px",
  },
  studentPage: {
    background: "linear-gradient(to right, #43cea2, #185a9d)",
    minHeight: "100vh",
    color: "white",
    padding: "20px",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    backdropFilter: "blur(8px)",
  },
  projectBox: {
    background: "rgba(0,0,0,0.2)",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "10px",
  },
  smallButton: {
    padding: "5px 10px",
    background: "#007acc",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginTop: "5px",
  },
  progressOuter: {
    width: "100%",
    background: "#ddd",
    borderRadius: "10px",
    overflow: "hidden",
    height: "10px",
  },
  progressInner: {
    height: "100%",
    background: "#00f2fe",
  },
  chatBox: {
    background: "rgba(255,255,255,0.1)",
    height: "150px",
    overflowY: "auto",
    borderRadius: "8px",
    padding: "8px",
    marginBottom: "10px",
  },
  chatMessage: {
    background: "rgba(0,0,0,0.3)",
    padding: "5px",
    borderRadius: "5px",
    marginBottom: "5px",
  },
};

export default App;