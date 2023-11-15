const express = require("express");
const router = express.Router();
//Midleware de auth
const auth = require("../middleware/auth")


//subir archivos con multer
//importar multer y configurar
const multer = require("multer")
//configuracion de subida (storage)
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./uploads/publications/")
    },

    filename: (req, file, cb) => {
        cb(null, "pub-"+Date.now()+"-"+file.originalname)
    }
})
//midleware storage
const uploads = multer({storage});
//fin configuracion multer



const publicationsController = require("../controllers/publications");

//Definir las rutas
router.get("/prueba-publications", publicationsController.pruebaPublications)
//Metodo save
router.post("/save", auth, publicationsController.save)
//One publication
router.get("/detail/:id", auth, publicationsController.detail)
//delete publication
router.delete("/remove/:id", auth, publicationsController.remove);
//obtener la publication del usuario autenticado
router.get("/user/:id/:page?", auth, publicationsController.user)
//update publication file imagen
router.post("/upload/:id",[auth, uploads.single("file0")], publicationsController.upload);

//Exportar router
module.exports = router;