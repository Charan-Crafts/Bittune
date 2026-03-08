const express = require("express")

const router= express.Router()

const adminController= require("../controllers/admin.controller")

const authMiddleware = require("../middleware/auth.middleware")

const upload = require("../middleware/multer.middleware")

router.post("/create-album",authMiddleware,upload.single("thumbnail"),adminController.createAlbum)

router.post("/upload-song",authMiddleware,upload.single("audio"),adminController.uploadSong)

router.put("/add-thumbnail",authMiddleware,upload.single("thumbnail"),adminController.addThumbnailToSong)

router.delete("/delete-song/:songId",authMiddleware,adminController.deleteSongById)

router.delete("/delete-album/:albumId",authMiddleware,adminController.deleteAlbumById)

module.exports = router;