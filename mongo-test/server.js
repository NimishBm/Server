const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/testDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Model
const User = mongoose.model("User", {
  name: String,
  age: Number,
  city: String
});

// Home
app.get("/", (req, res) => {
  res.send("Server is working!");
});

// GET USERS
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD USER
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE USER
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE USER
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted",
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});