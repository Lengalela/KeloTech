require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const pool = require("./database");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or specific domains
    methods: ["GET", "POST"],
  },
});

// Attach `io` to app for use in controllers
app.set("io", io);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const learnerRoutes = require("./Routes/LearnerRoutes");
app.use("/api/learners", learnerRoutes);

// WebSocket connection
io.on("connection", (socket) => {
  console.log("🟢 Learner connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Learner disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
