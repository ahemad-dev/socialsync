require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const inviteRoutes = require('./routes/inviteRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');

const app = express();

// ✅ HTTP + Socket.io server banane ke liye
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://fc0ac6fa8d54.ngrok-free.app"],
    methods: ["GET", "POST"]
  }
});

// 🔌 jab client connect ho
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ✅ make io accessible in controllers
app.set("io", io);

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://socialsync-three.vercel.app"
  ],
  credentials: true
}));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/events', inviteRoutes); // invites
app.use('/api/rsvp', rsvpRoutes);

app.get('/', (req, res) => res.send('SocialSync API running'));

const PORT = process.env.PORT || 5001;
// ✅ yahan app.listen nahi, server.listen use karna hai
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
