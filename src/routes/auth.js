const express = require("express"); 
const router = express.Router();

const authController = require("../controllers/usuarioController");


router.post("/register",authController.registerUsuario);

router.post("/login",authController.loginUsuario);

module.exports = router;