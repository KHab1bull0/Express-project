import express from "express";
import multer from "multer";
import { productController } from "../controller/product.controller.js";
import { auth, roleGuard } from '../common/middleware/auth.middleware.js';

const productRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * components:
 *   schemas:
 *     Mahsulot:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: Mahsulotning unikal ID raqami (MongoDB tomonidan yaratiladi)
 *         name:
 *           type: string
 *           description: Mahsulot nomi
 *         price:
 *           type: number
 *           description: Mahsulot narxi
 *         description:
 *           type: string
 *           description: Mahsulot haqida qisqacha ma'lumot
 *         imageUrl:
 *           type: string
 *           description: Mahsulot rasmi URL manzili
 *       example:
 *         name: "Smartfon X"
 *         price: 999.99
 *         description: "Eng so'nggi modeldagi smartfon"
 *         imageUrl: "https://example.com/images/smartphone-x.jpg"
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Mahsulotlar ro'yxatini olish
 *     tags: [Mahsulotlar]
 *     responses:
 *       200:
 *         description: Mahsulotlar ro'yxati muvaffaqiyatli qaytarildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mahsulot'
 * 
 *   post:
 *     summary: Yangi mahsulot qo'shish
 *     tags: [Mahsulotlar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Mahsulot muvaffaqiyatli qo'shildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Mahsulot'
 *       400:
 *         description: Noto'g'ri ma'lumotlar
 *       401:
 *         description: Autentifikatsiya xatosi
 *       403:
 *         description: Ruxsat etilmagan
 * 
 * /api/products/{id}:
 *   put:
 *     summary: Mahsulotni yangilash
 *     tags: [Mahsulotlar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Mahsulot ID si
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Mahsulot muvaffaqiyatli yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Mahsulot'
 *       400:
 *         description: Noto'g'ri ma'lumotlar
 *       401:
 *         description: Autentifikatsiya xatosi
 *       403:
 *         description: Ruxsat etilmagan
 *       404:
 *         description: Mahsulot topilmadi
 * 
 * api/products/{id}: 
 *   delete:
 *     summary: Mahsulotni o'chirish
 *     tags: [Mahsulotlar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:  
 *           type: string
 *         required: true
 *         description: Mahsulot ID si
 *     responses:
 *       200:
 *         description: Mahsulot muvaffaqiyatli o'chirildi
 *         content:
 *           application/json:
 *             schema:    
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Mahsulot'
 *                 status:
 *                   type: number 
 *                 success: 
 *                   type: boolean
 *       401:
 *         description: Autentifikatsiya xatosi
 *       403:
 *         description: Ruxsat etilmagan
 *       404:
 *         description: Mahsulot topilmadi
 */

productRouter.get("/products", productController.getAllProducts);
productRouter.post("/products", auth, roleGuard('admin'), upload.single('image'), productController.createProduct);
productRouter.put("/products/:id", auth, roleGuard('admin'), upload.single('image'), productController.updateProduct);
productRouter.delete("/products/:id", auth, roleGuard('admin'), productController.deleteProduct);

export default productRouter;