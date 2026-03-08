const express = require("express");

const router= express.Router()

const authController = require("../controller/auth.controller")

const authMiddleware = require("../middleware/auth.middleware")

router.get("/profile",authMiddleware,authController.userProfile)

router.post("/register",authController.register)

router.post("/login",authController.login)

router.post("/logout",authMiddleware,authController.logout)

module.exports = router;