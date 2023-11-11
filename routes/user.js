const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require('../middleware/auth');


//Definir las rutas
router.post("/register", userController.register) //enviar-guardar
router.post("/login", userController.login) // publico, sin auth
router.get("/prueba-usuario", auth, userController.pruebaUser);
//Obtener el profile del usuario
router.get("/profile/:id", auth, userController.profile);

//Exportar router
module.exports = router;