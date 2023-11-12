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
const save = (req, res) => {
    //conseguir los datos del body
    const params = req.body;

    //Sacar el id del usuario identificado
    const identity = req.user;

    //crear el objeto con modelo follow
    let userToFollow = new Follow({
        user: identity.id,
        followed: params.followed
    });

    //guardar objeto en BD
    userToFollow.save((error, followStored ) => {

        if(error || !followStored) {
            return res.status(500).json({
                status: "success",
                message: "No se ha podido seguir al usuario"

            })
           

        }

        return res.status(200).json({
            status: "success",
            identity: req.user,
            follow: userToFollow

        })

    })


    

}

//Metodo de borrar un follow o dejar de seguir

//metodo para listar usuarios que estoy siguiendo

//Listar los usuarios que me siguen


//Exportar acciones
module.exports ={ 
    pruebaFollow,
    save
}