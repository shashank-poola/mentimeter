import cors from "cors";
import "dotenv/config";
import http from "http";
import express from "express";
import routes from "./routes/index";

const app = express();
const server = http.createServer(app);
app.use(express.json());

const PORT = process.env.PORT || 8000;

const ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
app.use(
    cors({
        origin: ALLOWED_ORIGINS,
        credentials: true,
    })
);

app.use("/api/v1", routes)

server.listen(8000, () => {
    console.log("Server is running port : 8000")
});