require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");
const pool = require("./database");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or restrict to specific domains
    methods: ["GET", "POST"],
  },
});

// Attach `io` to app for use in controllers
app.set("io", io);

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files from the Frontend_website folder
app.use(express.static(path.join(__dirname, "Frontend_website")));

// Define the default route to serve login.html (or index.html if that's preferred)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend_website", "login.html"));
});

// API Routes
const learnerRoutes = require("./Routes/LearnerRoutes");
app.use("/api/learners", learnerRoutes);

const courseRoutes = require("./Routes/CoursesRoutes");
app.use("/api/courses", courseRoutes);

const lessonRoutes = require("./Routes/LessonRoutes");
app.use("/api", lessonRoutes);
const enrollmentRoutes = require("./Routes/EnrollmentRoutes");
app.use("/api/enrollments", enrollmentRoutes);

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
