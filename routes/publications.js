const express = require("express");
const router = express.Router();

const publicationsController = require("../controllers/publications");

//Definir las rutas
router.get("/prueba-publications", publicationsController.pruebaPublications)


//Exportar router
module.exports = router;