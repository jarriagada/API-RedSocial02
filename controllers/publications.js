const Publication = require("../models/publication");

//Acciones de prueba:
const pruebaPublications = (req, res) =>{
    return res.status(200).json({
        status: "success",
        message: "Desde PublicationController"
    })
} ;



//Exportar acciones
module.exports ={ 
    pruebaPublications
}