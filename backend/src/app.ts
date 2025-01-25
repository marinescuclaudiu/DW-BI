import express from "express";
import { categoryRouter } from "./routes/categoryRoute";
import { subcategoryRouter } from "./routes/subcategoryRoute";
import { discountRouter } from "./routes/discountRoute";
import { cafeRouter } from "./routes/cafeRoute";
import { userRouter } from "./routes/userRoute";
import { productRouter } from "./routes/productRoute";
import { orderRouter } from "./routes/orderRoute";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Adresa frontend-ului tău
    methods: ["GET", "POST", "PUT", "DELETE"], // Metode permise
    allowedHeaders: ["Content-Type", "Authorization"], // Headere permise
    credentials: true, // Permite cookie-uri/token-uri
  })
);

app.options("*", cors());

app.use(express.json());

app.use("/api", categoryRouter);
app.use("/api", subcategoryRouter);
app.use("/api", discountRouter);
app.use("/api", cafeRouter);
app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api", orderRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
