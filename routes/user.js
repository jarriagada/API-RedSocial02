const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

//Definir las rutas
router.get("/prueba-user", userController.pruebaUser)


//Exportar router
module.exports = router;