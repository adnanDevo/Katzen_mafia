import express from "express";
import cookieParser from "cookie-parser";

import { router as catRouter } from "./src/router/cat.router.js";
import { router as clanRouter } from "./src/router/clan.router.js";
import { router as regionRouter } from "./src/router/region.router.js";

import cors from "cors";

process.loadEnvFile(".env");

console.log("DB_PASSWORD geladen:", Boolean(process.env.DB_PASSWORD));

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

app.use(express.json());

// Cookies zuerst verarbeiten!
app.use(cookieParser());

// Danach die Router
app.use("/api", catRouter);
app.use("/api", clanRouter);
app.use("/api", regionRouter);

app.listen(PORT, () => {
    console.log("Ein Mautzu erscheint in Port:", PORT);
});