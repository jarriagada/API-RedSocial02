//importar el modelo user
const User = require("../models/user")
//importar bcript para cifrar contraseña npm install bcrypt
const bcrypt = require("bcrypt")

//Importar servicios jwt
const jwt = require("../services/jwt");


const register = async (req, res) => {
    const { name, surname, nick, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ $or: [{ email }, { nick }] });
      if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }
  
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear un nuevo documento de usuario con la contraseña encriptada
      const user = new User({ name, surname, nick, email, password: hashedPassword });
  
      // Guardar el usuario en la base de datos
      await user.save();
  
      res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al registrar el usuario", error });
    }
  }


const login = (req, res) => {
  // Recoger parametros del body
  let params = req.body;

  // Comprobar que existan
  if (!params.email || !params.password) {
    return res.status(400).json({
      status: 400,
      message: "Campos obligatorios: email, password",
      params
    });
  }

  // Buscar en la BD si existe
  User.findOne({ email: params.email }, async (error, user) => { 
    if (error || !user) {
      return res.status(404).json({
        status: 404,
        message: "No existe el usuario",
        varerror: error,
        user: user
      });
    }

    try {
      // Comparar la contraseña proporcionada con la contraseña encriptada almacenada en la base de datos
      const passwordMatch = await bcrypt.compare(params.password, user.password);
      
      if (!passwordMatch) {
        return res.status(400).json({
          status: 400,
          message: "No te has logeado correctamente",
          params,
          user,
          passwordMatch: passwordMatch
        });
      }
      
      //Conseguir el token

      // Devolver el Token
      const token = jwt.createToken(user)

      // Devolver los datos del usuario
      return res.status(200).json({
        status: 200,
        message: "Logeado correctamente",
        user: {
            id: user._id,
            name: user.name,
            nick: user.nick
        },
        token
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Error al comparar la contraseña",
        error
      });
    }
  });
}

//Exportar acciones
module.exports = {
    register, 
    login
}