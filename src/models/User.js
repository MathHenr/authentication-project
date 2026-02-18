const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    select: false,
  },
  lastIp: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Criar um hook para ter certeza de salvar senha como hash
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (e) {
    throw e;
  }
});

module.exports = mongoose.model("User", UserSchema);
