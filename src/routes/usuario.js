const express = require("express"); 
const router = express.Router();
const auth = require("../middlewares/auth");
const authController = require("../controllers/usuarioController");

router.get("/getUsuario",auth,authController.getUsuario);
router.put("/updateUsuario",auth,authController.updateUsuario);
router.delete("/deleteUsuario",auth,authController.deleteUsuario);

module.exports = router;