const express = require("express")

const router = express.Router()

const songcontroller = require("../controllers/songs.controller")

const authMiddleware = require("../middlewares/auth.middleware")

router.get("/allsongs",authMiddleware,songcontroller.getAllSongs)

router.get("/albums",authMiddleware,songcontroller.getAlbums)


router.get("/album/:albumId",authMiddleware,songcontroller.getSongsByAlbumId)


router.get("/:songId",authMiddleware,songcontroller.getSongById)


module.exports = router;