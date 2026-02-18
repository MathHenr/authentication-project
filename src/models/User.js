const mongosose = require("mongoose");

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

module.exports = mongoose.model("User", Userschema);
