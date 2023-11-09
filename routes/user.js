const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");


//Definir las rutas
router.post("/register", userController.register) //enviar-guardar
router.post("/login", userController.login) //


//Exportar router
module.exports = router;