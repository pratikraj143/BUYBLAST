const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));

connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/product", require("./routes/productRoutes"));

// Root API test
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔁 In-memory message store
let messages = []; // { id, text, replyTo }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send old messages in chronological order (old to new)
  socket.emit("init_messages", messages);

  // 📥 Handle new message
  socket.on("send_message", (msg) => {
    const newMsg = {
      id: Date.now(), // unique id
      text: msg.text, // message text
      replyTo: msg.replyTo || null, // optional reply id
    };

    messages.push(newMsg); // Add to memory
    io.emit("receive_message", newMsg); // Send to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
