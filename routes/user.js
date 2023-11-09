const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");


//Definir las rutas
router.get("/prueba-user", userController.pruebaUser)
router.post("/register", userController.register) //enviar-guardar


//Exportar router
module.exports = router;