//importar el modelo user
const User = require("../models/user")
//importar bcript para cifrar contraseña npm install bcrypt
const bcrypt = require("bcrypt")

//Acciones de prueba:
const pruebaUser = (req, res) => {

    return res.status(200).json({
        status: "success",
        message: "Desde UserController"
    })
};



//Metodo registra Usuario
const register = (req, res) => {

    //Recoger los datos de la peticion
    let params = req.body;

    //Comprobar los datos + validacion, si no pasa return lo saca.
    if (!params.name || !params.password || !params.email || !params.nick) {
        return res.status(400).json({
            status: "error",
            message: "Error campos obligatorios, faltan datos por enviar "
        })
    }

    //Control de usurios duplicados
    User.find({
        $Or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() }
        ]

    }).exec(async (error, users) => {
        if (error) return res.status(500).json(
            {
                status: "error",
                message: "error en la consulta de usuarios"
            });

        if (users && users.length >= 0) {
            return res.status(200).json(
                {
                    status: "success",
                    message: "el usuario ya existe"
                })
        };

        //Cifrar la contraseña y actualizar el campo passwor 
        //con la contraseña cifrada
        let pwd = await bcrypt.hash(params.password, 10)
        params.password = pwd;

        //Crear nuevo objeto con el pwd encriptado
        let user_to_save = new User(params);

        //Guardar usuario en la BD
        user_to_save.save((error, userStores) => {
            if (error || !userStores) 
                return res.status(500).json({
                    status: "error",
                    message: "error al guardar el usuario"
                });


        return res.status(200).json(
            {
                status: "success",
                message: "Usuario registrado correctamente",
                user: userStores
            })
            
        })

        //Devolver el resultado
        return res.status(200).json({
            status: "success",
            message: "Usuario Registrado",
            params,
            user_to_save
        });

    }

    );






}



//Exportar acciones
module.exports = {
    pruebaUser,
    register
}