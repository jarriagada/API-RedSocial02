// importar dependencias
const {connection} = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Mensaje
console.log("API redsocial arrancada!!")

// conexion a la bd
connection();

//crear servidor node
const app = express();
const puerto = 3900;

//configuracion de cors
app.use(cors());

//convertir los datos del body a objetos js con midleware express
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//cargar las rutas


app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json({
        "id": 1,
        "Nombre": "jarriagada",
        "web": "jarriagada.cl"


})

} );

//poner a escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor node corriendo en el puerto "+puerto);
});
