

//Acciones de prueba:
const pruebaUser = (req, res) =>{
    return res.status(200).json({
        status: "success",
        message: "Desde UserController"
    })
} 

//Exportar acciones
module.exports ={ 
    pruebaUser
}