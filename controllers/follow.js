//Acciones de prueba:
const pruebaFollow = (req, res) =>{
    return res.status(200).json({
        status: "success",
        message: "Desde FollowController"
    })
} ;





//Exportar acciones
module.exports ={ 
    pruebaFollow
}