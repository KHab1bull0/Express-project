import { Router } from "express";
import userRouter from "./user.route.js";
import productRouter from "./product.route.js";

export const router = Router();

router.use(userRouter);
router.use(productRouter);
