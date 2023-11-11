//Importar modelo
const Follow = require("../models/follow");
const User = require("../models/user");




//Acciones de prueba:
const pruebaFollow = (req, res) =>{
    return res.status(200).json({
        status: "success",
        message: "Desde FollowController"
    })
} ;

//Metodo de guardar un follow o seguir

//Metodo de borrar un follow o dejar de seguir

//metodo para listar usuarios que estoy siguiendo

//Listar los usuarios que me siguen


//Exportar acciones
module.exports ={ 
    pruebaFollow
}