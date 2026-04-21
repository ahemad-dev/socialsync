require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const rsvpRoutes = require("./routes/rsvpRoutes");

const app = express();
const server = http.createServer(app);

/* ===============================
   Allowed Origins
=================================*/
const allowedOrigins = [
  "http://localhost:5173",
  "https://socialsync-three.vercel.app"
];

/* ===============================
   CORS for Express
=================================*/
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ===============================
   Middlewares
=================================*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   Socket.io
=================================*/
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      return callback("Not allowed", false);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.set("io", io);

/* ===============================
   DB Connect
=================================*/
connectDB();

/* ===============================
   Routes
=================================*/
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/events", inviteRoutes);
app.use("/api/rsvp", rsvpRoutes);

app.get("/", (req, res) => {
  res.send("SocialSync API Running");
});

/* ===============================
   Server Start
=================================*/
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});