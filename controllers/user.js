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


const register = async (req, res) => {
    const { name, surname, nick, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ $or: [{ email }, { nick }] });
      if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }
  
      // Crear un nuevo documento de usuario
      const user = new User({ name, surname, nick, email, password });
  
      // Guardar el usuario en la base de datos
      await user.save();
  
      res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al registrar el usuario", error });
    }
  }


//Exportar acciones
module.exports = {
    pruebaUser,
    register
}