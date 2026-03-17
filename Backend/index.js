
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { initDatabase } from "./models/Database.js";
import { memeRouter } from "./routes/memeRouter.js";
import { authRouter } from "./routes/authRouter.js";
import path from "path";
import 'dotenv/config.js';

initDatabase();

const app = express(); // creates an express application
const PORT = process.env.PORT || 3000;

// Register the morgan logging middleware, use the 'dev' format
app.use(morgan('dev'));

app.use(cors());

// Parse incoming requests with a JSON payload
app.use(express.json());

app.use("/meme", memeRouter);
app.use("/auth", authRouter);
app.use("/images", express.static(path.join(process.cwd(), "images")));

//error handler
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500).json({
        code: err.status || 500,
        description: err.message || "An error occurred"
    });
});


app.listen(PORT);