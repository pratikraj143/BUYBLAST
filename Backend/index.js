const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const Message = require("./models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = "https://buy-blast.vercel.app";

const io = new Server(server, {
  cors: {
    origin: [FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  },
});

app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));

connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/product", require("./routes/productRoutes"));

// API to get all messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// API to manually post messages (if needed)
app.post("/api/messages", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// API to delete message (if within 1 hour)
app.delete("/api/messages/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    const oneHour = 60 * 60 * 1000;
    const now = Date.now();
    const messageTime = new Date(message.timestamp).getTime();

    if (now - messageTime > oneHour) {
      return res.status(403).json({ error: "Cannot delete message after 1 hour" });
    }

    await message.deleteOne();
    io.emit("delete_message", req.params.id); // Notify all clients to delete
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// Root API test
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

<<<<<<< HEAD
  // Message events
=======
>>>>>>> d673dc5 (Update index.js)
  socket.on("send_message", async (msg) => {
    try {
      const saved = await Message.create({
        text: msg.text,
        sender: msg.sender || "Anonymous",
        replyTo: msg.replyTo || null,
      });
      io.emit("receive_message", saved); // Broadcast to all clients
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });
<<<<<<< HEAD
  
  // Product events
  socket.on("new_product", (product) => {
    console.log("📦 New product received via socket:", product.title);
    io.emit("new_product", product); // Broadcast to all clients
  });
  
  socket.on("update_product", (product) => {
    console.log("🔄 Product update received via socket:", product._id);
    io.emit("update_product", product); // Broadcast to all clients
  });
  
  socket.on("delete_product", (productId) => {
    console.log("🗑️ Product delete received via socket:", productId);
    io.emit("delete_product", productId); // Broadcast to all clients
  });
=======
>>>>>>> d673dc5 (Update index.js)

  socket.on("delete_message", async (id) => {
    try {
      const message = await Message.findById(id);
      if (!message) return;

      const oneHour = 60 * 60 * 1000;
      const now = Date.now();
      const messageTime = new Date(message.timestamp).getTime();

      if (now - messageTime > oneHour) return;

      await message.deleteOne();
      io.emit("delete_message", id); // Notify all clients
    } catch (err) {
      console.error("❌ Error deleting message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
<<<<<<< HEAD
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
=======
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
>>>>>>> d673dc5 (Update index.js)
