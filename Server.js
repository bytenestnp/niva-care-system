const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ===== IN-MEMORY DATABASE =====
let medications = [
  { time: "09:00", name: "Paracetamol" }
];

let history = [];
let emergencyAlerts = [];
let lastSeen = null;

// ===== ROUTES =====

// Get medication schedule
app.get("/getMedication", (req, res) => {
  res.json(medications);
});

// Log medication taken
app.post("/taken", (req, res) => {
  const { name, time } = req.body;

  history.push({
    name,
    time,
    takenAt: new Date()
  });

  res.json({ status: "logged" });
});

// Get history
app.get("/history", (req, res) => {
  res.json(history);
});

// Emergency alert
app.post("/emergency", (req, res) => {
  emergencyAlerts.push({
    time: new Date()
  });

  res.json({ status: "alert received" });
});

// Get emergency alerts
app.get("/alerts", (req, res) => {
  res.json(emergencyAlerts);
});

// Watch heartbeat
app.post("/heartbeat", (req, res) => {
  lastSeen = new Date();
  res.json({ status: "alive" });
});

// Watch status
app.get("/status", (req, res) => {
  if (!lastSeen) return res.json({ status: "offline" });

  const diff = (new Date() - lastSeen) / 1000;

  res.json({
    status: diff < 10 ? "online" : "offline"
  });
});
app.get("/", (req, res) => {
  res.send("Niva Care Server is Running 🚀");
}); 
// ===== START SERVER =====
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
