
// @ts-nocheck

import cors from "cors";
import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
main();
async function main() {
    // -----------------------------------------------------------
    const app = express();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // -----------------------------------------------------------
    const PORT = 3000;
    const indexHTMl = path.join(__dirname, "../API/intex.html");
    const publicDir = path.join(__dirname, "../API");
    const uploadDir = path.join(__dirname, "../uploads");
    // -----------------------------------------------------------
    const storage = multer.diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    });
    const upload = multer({ storage });
    app.use(cors());
    app.post("/upload", upload.single("archivo"), (req, res) => {
        if (!req.file) return res.status(400).send("No se ha subido ningún archivo.");
        res.send(`Archivo subido correctamente: ${req.file.filename}`);
    });
    // -----------------------------------------------------------
    app.get("/", (req, res) => res.sendFile(indexHTMl));
    app.use(express.static(publicDir));
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
}