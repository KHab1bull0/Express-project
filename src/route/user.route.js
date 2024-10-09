import express from "express";
import { userController } from "../controller/user.controller.js";
import { auth, roleGuard } from "../common/middleware/auth.middleware.js";

const userRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Foydalanuvchining unikal ID raqami (MongoDB tomonidan yaratiladi)
 *         username:
 *           type: string
 *           description: Foydalanuvchi nomi
 *         email:
 *           type: string
 *           description: Foydalanuvchi elektron pochtasi
 *         password:
 *           type: string
 *           description: Foydalanuvchi paroli (heshlanadi)
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: Foydalanuvchi roli
 *       example:
 *         username: "john_doe"
 *         email: "john@example.com"
 *         password: "hashedpassword123"
 *         role: "user"
 *
 * /api/users:
 *   get:
 *     summary: Foydalanuvchilar ro'yxatini olish
 *     tags: [Foydalanuvchilar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchilar ro'yxati muvaffaqiyatli qaytarildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Autentifikatsiya xatosi
 *       403:
 *         description: Ruxsat etilmagan
 *
 *   post:
 *     summary: Yangi foydalanuvchi yaratish
 *     tags: [Foydalanuvchilar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Foydalanuvchi muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: number
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Noto'g'ri ma'lumotlar
 *
 * /api/users/login:
 *   post:
 *     summary: Foydalanuvchi tizimga kirishi
 *     tags: [Foydalanuvchilar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "Jamshid"
 *               password: "admin123"
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli tizimga kirish
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: number
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 example:
 *                   message: "Kirish muvaffaqiyatli bo'ldi"
 *                   status: 200
 *                   success: true
 *                   token: "JWT token"
 *       401:
 *         description: Noto'g'ri username yoki parol
 *
 * /api/users/{id}:
 *   delete:
 *     summary: Foydalanuvchini o'chirish
 *     tags: [Foydalanuvchilar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Foydalanuvchi muvaffaqiyatli o'chirildi
 *       401:
 *         description: Autentifikatsiya xatosi
 *       403:
 *         description: Ruxsat etilmagan
 *       404:
 *         description: Foydalanuvchi topilmadi
 *
 *   put:
 *     summary: Foydalanuvchi ma'lumotlarini yangilash
 *     tags: [Foydalanuvchilar]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "newusername"
 *               password: "newpassword"
 *     responses:
 *       200:
 *         description: Foydalanuvchi ma'lumotlari muvaffaqiyatli yangilandi
 *       400:
 *         description: Xatolik yuz berdi
 *       404:
 *         description: Foydalanuvchi topilmadi
 */

userRouter.get("/users", auth, roleGuard("admin"), userController.getAllUsers);
userRouter.post("/users", userController.createUser);
userRouter.post("/users/login", userController.loginUser);
userRouter.delete(
  "/users/:id",
  auth,
  roleGuard("admin"),
  userController.deleteUser
);
userRouter.put(
  "/users/:id",
  auth,
  roleGuard("admin"),
  userController.updateUser
);

export default userRouter;
