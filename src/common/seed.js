import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminPassword = await bcrypt.hash("admin123", 10);

    const admin = {
      username: "admin",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "admin",
    };

    await User.findOneAndUpdate(
      { email: admin.email },
      { $set: admin },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
