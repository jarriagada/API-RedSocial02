const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require('../middleware/auth');

//subir archivos con multer
//importar multer y configurar
const multer = require("multer")
//configuracion de subida (storage)
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./uploads/avatars/")
    },

    filename: (req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname)
    }
})

//midleware storage
const uploads = multer({storage});


//Definir las rutas
router.post("/register", userController.register) //enviar-guardar
router.post("/login", userController.login) // publico, sin auth
router.get("/prueba-usuario", auth, userController.pruebaUser);
//Obtener el profile del usuario
router.get("/profile/:id", auth, userController.profile);
router.get("/list/:page?", auth, userController.list);
//actualizar elemento del back-end por put
//se envian los parametros del usuario por la autenticacion
router.put("/update", auth, userController.update);
//Metodo para subir archivos, auth y midleware de de multer
router.post("/upload", [auth, uploads.single("file0")], userController.upload);


//Exportar router
module.exports = router;

