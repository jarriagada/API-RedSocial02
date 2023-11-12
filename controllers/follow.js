// Importar modelo
const Follow = require("../models/follow");
const User = require("../models/user");

// Acción de prueba
const pruebaFollow = (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Desde FollowController"
  });
};

// Método de guardar un follow o seguir
const saveFollow = (req, res) => {
  // Conseguir los datos del body
  const params = req.body;

  // Sacar el id del usuario identificado
  const identity = req.user;

  // Verificar si el usuario está intentando seguirse a sí mismo
  if (identity.id === params.followed) {
    return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
  }

  Follow.findOne({ user: identity.id, followed: params.followed }, (error, followFound) => {
    if (error) {
      return res.status(500).json({
        status: "error",
        message: "Error al comprobar si ya sigues a este usuario"
      });
    }

    if (followFound) {
      return res.status(500).json({
        status: "error",
        message: "Ya sigues a este usuario"
      });
    }

    // Crear el objeto con modelo follow
    let userToFollow = new Follow({
      user: identity.id,
      followed: params.followed
    });

    // Guardar objeto en BD
    userToFollow.save((error, followStored) => {
      if (error || !followStored) {
        return res.status(500).json({
          status: "error",
          message: "No se ha podido seguir al usuario"
        });
      }

      return res.status(200).json({
        status: "success",
        identity: req.user,
        follow: userToFollow
      });
    });
  });
};



const unFollow = async (req, res) => {
  try {
    //console.log(req.params)
    const { id } = req.params;
    const userId  = req.user.id;
    
    // Verificar si el usuario seguido existe en la colección de usuarios
    const userFollowed = await User.findById(id);
    if (!userFollowed) {
      return res.status(404).json({ error: "Usuario seguido no encontrado" });
    }
    
    // Verificar si el usuario está intentando dejar de seguirse a sí mismo
    if (id === userId) {
      return res.status(400).json({ error: "No puedes dejar de seguirte a ti mismo" });
    }

    // Verificar si existe la relación de seguimiento
    const follow = await Follow.findOne({ user: userId, followed: id });
    if (!follow) {
      return res.status(404).json({ 
        error: "Relación de seguimiento no encontrada"
    });
    }

    // Eliminar la relación de seguimiento
    await Follow.findByIdAndRemove(follow._id);

    res.json({ message: "Dejaste de seguir al usuario exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        error: "Ocurrió un error al dejar de seguir al usuario"
    });
  }
};


// Exportar acciones
module.exports = {
  pruebaFollow,
  saveFollow,
  unFollow
};