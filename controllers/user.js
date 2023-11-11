//importar el modelo user
const User = require("../models/user")
//importar bcript para cifrar contraseña npm install bcrypt
const bcrypt = require("bcrypt")
//Importar servicios jwt
const jwt = require("../services/jwt");
//paginacion
const mongoosepagination = require("mongoose-pagination");
//libreia file system, para borrar archivo
const fs = require("fs");
//para el path absoluto
const path = require("path")


const register = async (req, res) => {
  const { name, surname, password, email, nick, bio } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { nick: nick.toLowerCase() }
      ]
    });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo documento de usuario con la contraseña encriptada para devolver
    const user = new User({ name, surname, nick: nick.toLowerCase(), email: email.toLowerCase(), password: hashedPassword, bio });

    // Guardar el usuario en la base de datos
    await user.save();

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: user
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar el usuario",
      error
    });
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


const pruebaUser = (req, res) => {
  return res.status(200).json({
    message: "...mensaje desde user/controller",
    user: req.user
  })
}

//Metodo para traer el perfil de un usuario
const profile = (req, res) => {
  //recibir el parametro que viene por la url
  const id = req.params.id;
  //Consulta para sacar los datos del usuario
  User.findById(id)
    .select({ password: 0, role: 0 })
    .exec((error, userProfile) => {
      if (error || !userProfile) {
        return res.status(404).json({
          status: "error",
          mensaje: "error al obtener el profile",
          userProfile
        })
      }

      //Devolver el resultado
      return res.status(200).json({
        status: "success",
        message: "Perfil encontrado",
        userProfile
      });
    });

};//fin profile



//Listar usuarios con paginacion:
const list = (req, res) => {
  //saber en que pagina estamos, viene en la url
  let page = 1;

  if (req.params.page) {
    page = req.params.page;
  }
  //siempre con valor entero
  page = parseInt(page);
  //consultar con mongoose paginate
  let itemsPerPage = 5;
  //Consulta con mongoose paginate
  User.find().sort('_id').paginate(page, itemsPerPage, (error, users, total) => {
    //Validacion

    if (error) {

      return res.status(200).json({
        status: "error",
        message: "error al listar usuarios",
        page,
        users,
        total,
        pages: Math.ceil(total / itemsPerPage)
        //ceil redondea al alza
      });

    }

    //Devolver el resultado
    return res.status(200).json({
      status: "success",
      message: "ruta de Listado de usuarios",
      page,
      users,
      total
    });

  })

};//fin list

//metodo para actualizar usuario
const update = (req, res) => {
  //Recoger info del usuario a a ctualizar
  const userIdentity = req.user;
  const userToUpdate = req.body;


  //Eliminar campos sobrantes
  delete userToUpdate.iat;
  delete userToUpdate.exp;
  delete userToUpdate.role;
  delete userToUpdate.image;
  //comprobar que el usuario ya existe
  User.find({
    $or: [
      { email: userToUpdate.email.toLowerCase() },
      { nick: userToUpdate.nick.toLowerCase() }
    ]
  }).exec(async (error, users) => {
    if (error) return res.status(500).json({ status: "error", message: "error al comprobar usuario" })

    let userIsset = false;
    //recorrer los usuarios
    users.forEach(user => {
      if (user._id != userIdentity.id) userIsset = true;

    });

    if (userIsset) {
      return res.status(201).json({
        status: "success",
        message: "el usuario ya existe"
      })
    }

    //cifrar la contraseña
    if (userToUpdate.password) {
      let pwd = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = pwd;
    }
    userToUpdate.email = userToUpdate.email.toLowerCase();
    userToUpdate.nick = userToUpdate.nick.toLowerCase();


    try{
       // buscar y actualizar
    let userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });

    if (error || !userUpdated) {
      return res.status(500).json({
        status: "error",
        message: "error al actualizar usuario"
      })
    }

     //Devolver el resultado
     return res.status(200).json({
      status: "success",
      menssage: "usuario actualizado",
      user: userUpdated
    });

    }catch{

       //Devolver el resultado
    return res.status(500).json({
      status: "error",
      menssage: "error al actualizar"
    });

    }
  })//fin find
};//fin update


const upload = (req, res) => {
  // Recoger el fichero de imagen y comprobar que existe
  if (!req.file) {
    return res.status(404).json({
      status: "error",
      message: "Se debe incluir una imagen"
    });
  }

  // Conseguir el nombre del archivo
  const image = req.file.originalname;

  // Conseguir la extensión del archivo
  const extension = image.split(".").pop().toLowerCase();

  // Si la extensión no es correcta, borrar el archivo
  if (
    extension !== "png" &&
    extension !== "jpg" &&
    extension !== "jpeg" &&
    extension !== "gif"
  ) {
    const filepath = req.file.path;
    fs.unlinkSync(filepath);
    return res.status(400).json({
      status: "error",
      message: "Extensión inválida"
    });
  }

  // Actualizar el campo "image" en el usuario
  User.findByIdAndUpdate(
    req.user.id,
    { image: image },
    { new: true },
    (error, userUpdated) => {
      if (error || !userUpdated) {
        return res.status(500).json({
          status: "error",
          message: "Error al actualizar avatar de usuario"
        });
      }
      return res.status(200).json({
        status: "success",
        file: req.file,
        user: userUpdated
      });
    }
  );
};


//Metodo para mostrar avatar
const avatar = (req, res) => {

  //Sacar el parametro de la url :file
  const file = req.params.file;

  //Montar el path real de la imagen
  const filePath = "./uploads/avatars/" + file;

    /*
  //Comprobar si un archivo existe con stat
  fs.access(filePath, (error, exists) => {

    if (error || !exists) {
      return res.status(404).json({
        status: "error",
        message: "no existe la imagen"
      })
    }
*/
fs.access(filePath, fs.constants.F_OK, (error) => {
  if (error) {
    return res.status(404).json({
      status: "error",
      message: "No existe la imagen"
    });
  }

    //ruta absoluta
  return res.sendFile(path.resolve(filePath));

  })

}

//Exportar acciones
module.exports = {
  pruebaUser,
  register,
  login,
  profile,
  list,
  update,
  upload,
  avatar
}