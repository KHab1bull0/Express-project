import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-password");
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async createUser(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({ ...req.body, password: hashedPassword });
      await newUser.save();
      return res.status(201).json({
        message: "User created successfully",
        user: newUser,
        status: 201,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async loginUser(req, res) {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user && (await bcrypt.compare(req.body.password, user.password))) {
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET
        );
        return res.status(200).json({ message: "Login successful", status: 200, success: true, token });
      }
      return res.status(401).send({ message: "Noto'g'ri username yoki parol" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
      }
      return res.json({ message: "Foydalanuvchi muvaffaqiyatli o'chirildi" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const { username, password } = req.body;

      if (username) {
        const existingUser = await User.findOne({
          username,
          _id: { $ne: req.params.id },
        });
        if (existingUser) {
          return res
            .status(400)
            .json({ message: "Bu username allaqachon mavjud" });
        }
      }

      const updateData = {};
      if (username) updateData.username = username;
      if (password) updateData.password = await bcrypt.hash(password, 10);

      const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!user) {
        return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
      }

      return res.json({
        message: "Foydalanuvchi ma'lumotlari muvaffaqiyatli yangilandi",
        user,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};
