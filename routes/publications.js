const express = require("express");
const router = express.Router();
//Midleware de auth
const auth = require("../middleware/auth")

const publicationsController = require("../controllers/publications");

//Definir las rutas
router.get("/prueba-publications", publicationsController.pruebaPublications)
//Metodo save
router.post("/save", auth, publicationsController.save)
//One publication
router.get("/detail/:id", auth, publicationsController.detail)
//delete publication
router.delete("/remove/:id", auth, publicationsController.remove);

//Exportar router
module.exports = router;