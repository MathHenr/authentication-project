const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo conectado com sucesso!!");
  } catch (e) {
    console.log("❌ Erro ao conectado ao banco: ", e.message);
    process.exit(1);
  }
};

module.exports = connectDB;
