import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import authMiddleware from "./infrastructure/middleware/authMiddleware";

const app = express();

dotenv.config();

app.use(morgan("dev"));

const services = {
    auth: "http://localhost:3000",
    project: "http://localhost:3002",
    task: "http://localhost:3001",
    chat: "http://localhost:3003",
    notification: "http://localhost:3004",
};

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type"],
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    })
);

app.use(
    "/auth",
    createProxyMiddleware({ target: services.auth, changeOrigin: true }) 
);

app.use(
    "/project",
    authMiddleware(["admin", "project manager"]),
    createProxyMiddleware({ target: services.project, changeOrigin: true })
);

app.use(
    "/task",
    authMiddleware(["admin", "employee","project manager"]),
    createProxyMiddleware({ target: services.task, changeOrigin: true })
);
app.use(
    "/chat",
    authMiddleware(["admin", "project manager","employee"]),
    createProxyMiddleware({ target: services.chat, changeOrigin: true })
);
app.use(
    "/notification",
    authMiddleware(["admin", "project manager","employee"]),
    createProxyMiddleware({ target: services.notification, changeOrigin: true })
);

app.listen(process.env.PORT, () => {
    console.log("api gateway server is running on port 8080");
});
