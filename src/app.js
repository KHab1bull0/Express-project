import express, { urlencoded } from "express";
import connectDB from "./common/config/db.js";
import { router } from "./route/index.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const app = express();

app.use(express.json());
app.use("/api", router);

const initializeApp = async () => {
  await connectDB();
};

initializeApp().catch(console.error);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Mahsulot API",
      version: "1.0.0",
      description: "Mahsulotlar va foydalanuvchilar API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{
      bearerAuth: []
    }],
  },
  apis: ["./src/route/*.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
