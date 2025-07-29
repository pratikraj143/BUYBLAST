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

app.set("io", io);
app.use(cors());
app.use(express.json({ limit: "10mb" })); // allow base64 image data

connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/product", require("./routes/productRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// In-memory messages store (use DB in future)
let messages = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send existing messages to new user
  socket.emit("init_messages", messages);

  // On new message
  socket.on("send_message", (msg) => {
    messages.push(msg);
    io.emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
