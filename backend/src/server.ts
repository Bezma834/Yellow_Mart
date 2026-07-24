import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();


const allowedOrigins = [
  "https://yellow-mart-git-main-yellow-mart.vercel.app",
  "https://yellow-mart-8hi9622el-yellow-mart.vercel.app",
  "http://localhost:3000"
];


app.use(
  cors({
    origin: function (origin, callback) {

      // Allow Postman/mobile/no origin requests
      if (!origin) {
        return callback(null, true);
      }


      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }


      console.log("Blocked CORS:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },


    credentials: true,


    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS"
    ],


    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]

  })
);



app.use(express.json());



// Authentication routes
app.use(
  "/api/auth",
  authRoutes
);



// User routes
app.use(
  "/api",
  userRoutes
);



// Test backend
app.get("/", (req, res) => {

  res.send(
    "Yellow-Mart Backend Running 🚀"
  );

});



// Start server

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});