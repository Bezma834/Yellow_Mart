import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { authRouter } from "./controllers/authController";
import { userRouter } from "./controllers/userController";
import { actionRouter } from "./controllers/actionController";
import { graphqlRouter } from "./controllers/graphqlController";

dotenv.config();

const app = express();


const allowedOrigins = [
  "http://localhost:3000",
  "https://yellow-mart-coral.vercel.app"
];


app.use(
  cors({

    origin: (origin, callback) => {

      console.log("Incoming Origin:", origin);


      // Allow requests without origin (Postman, mobile apps, etc.)
      if (!origin) {
        return callback(null, true);
      }


      // Allow listed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }


      // Allow any Vercel deployment preview URL
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }


      console.log("Blocked Origin:", origin);

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


// JSON parser
app.use(express.json());



// Routes
app.use(
  "/api/auth",
  authRouter
);


// Hasura Action webhook handlers
app.use(
  "/api/actions",
  actionRouter
);


app.use(
  "/api",
  userRouter
);


// GraphQL proxy (holds Hasura admin secret server-side)
app.use(
  "/api",
  graphqlRouter
);



// Test route
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