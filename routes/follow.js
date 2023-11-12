const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');

const followController = require("../controllers/follow");

//Definir las rutas
router.get("/prueba-follow", auth, followController.pruebaFollow);
//post para enviar y guardar follow
router.post("/save", auth, followController.save);


//Exportar router
module.exports = router;