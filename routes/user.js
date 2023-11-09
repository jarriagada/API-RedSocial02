const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");


//Definir las rutas
router.get("/prueba-user", userController.pruebaUser)
router.get("/register", userController.register)


//Exportar router
module.exports = router;