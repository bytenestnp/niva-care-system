const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ===== DATABASE (temporary memory) =====
let medications = [
  { name: "Paracetamol", time: "09:00" }
];

let history = [];
let alerts = [];
let lastSeen = null;

// ===== ROOT =====
app.get("/", (req, res) => {
  res.send("Niva Care Server Running 🚀");
});

// ===== MEDICATION =====

// Get all meds
app.get("/getMedication", (req, res) => {
  res.json(medications);
});

// Add medication
app.post("/addMedication", (req, res) => {
  const { name, time } = req.body;

  if (!name || !time) {
    return res.status(400).json({ error: "Missing data" });
  }

  medications.push({ name, time });

  res.json({ status: "added" });
});

// Delete medication
app.post("/deleteMedication", (req, res) => {
  const { index } = req.body;

  medications.splice(index, 1);

  res.json({ status: "deleted" });
});

// ===== HISTORY =====

// Log taken
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

// ===== EMERGENCY =====

// Trigger alert
app.post("/emergency", (req, res) => {
  alerts.push({
    time: new Date()
  });

  res.json({ status: "alert received" });
});

// Get alerts
app.get("/alerts", (req, res) => {
  res.json(alerts);
});

// ===== STATUS =====

// Heartbeat
app.post("/heartbeat", (req, res) => {
  lastSeen = new Date();
  res.json({ status: "alive" });
});

// Online/offline
app.get("/status", (req, res) => {
  if (!lastSeen) return res.json({ status: "offline" });

  const diff = (new Date() - lastSeen) / 1000;

  res.json({
    status: diff < 10 ? "online" : "offline"
  });
});

// ===== START =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
