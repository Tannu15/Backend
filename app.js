import express from "express";
import cors from "cors";
import { config } from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/error.js";
//routes imports
import user from "./routes/userRoutes.js";

//for local host only
config({
  path: "./config/config.env",
});

const app = express();
const whitelist = [
  process.env.FRONTEND_URL,
  process.env.LOCAL_HOST,
  "http://127.0.0.1:5500",
];
const corsOptions = {
  credentials: true, // This is important.
  methods: ["GET", "POST", "DELETE", "PUT"],

  origin: (origin, callback) => {
    if (whitelist.includes(origin)) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

//routes

app.use(user);

//default route
app.get("/", (req, res) => {
  res.send("hooray! server is working");
});

app.use(ErrorMiddleware);

export default app;
