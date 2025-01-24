const express = require("express");
const Controller = require("./controller");
const multer = require("multer");

const router = express.Router();

// Multer Storage Configuration (Memory Storage for direct upload)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 3, // Maximum number of files allowed (1 to 3)
        fileSize: 10 * 1024 * 1024 // Max file size of 10MB
    },
});

// Ensure "files" matches the key used in your request (e.g., Postman)
router.post("/upload", upload.array('files', 3), Controller.save);
router.get("/detail", Controller.detail);


module.exports = router;
