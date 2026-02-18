const mongosose = require("mongoose");
const bcrypt = require("bcryptjs");

const Userschema = new mongosose.Schema({
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
Userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

module.exports = mongoose.model("User", Userschema);
