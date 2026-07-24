import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();


app.use(cors({
  origin: [
    "https://yellow-mart-git-main-yellow-mart.vercel.app",
    "https://yellow-mart-8hi9622el-yellow-mart.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true
}));


app.use(express.json());


app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api",
  userRoutes
);


app.get("/", (req, res) => {

  res.send(
    "Yellow-Mart Backend Running 🚀"
  );

});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});