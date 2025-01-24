const express = require("express");
const Controller = require('./controller');
const multer = require("multer");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { files: 1, fileSize: 10 * 1024 * 1024 }, // 10MB limit
    // fileFilter: (req, file, cb) => {
    //     if (file.mimetype === 'image/png') {
    //         cb(null, true);
    //     } else {
    //         cb(new Error("Only PNG files are allowed"));
    //     }
    // },
});

router.post("/upload", upload.single('file'), Controller.save);
router.get("/detail", Controller.detail);

module.exports = router;
