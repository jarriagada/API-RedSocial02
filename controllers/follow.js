// Importar modelo
const Follow = require("../models/follow");
const User = require("../models/user");
//importar dependencias mongoose para paginar
const mongoosePagination = require("mongoose-pagination");
//importar servicio followService
const followService = require("../services/followService");


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


// metodo para listar usuarios que cualquier usuario esta siguiendo
const following = (req, res) => {

    // Sacar el id del usurio identificado por token
    //para consultarm el user del documento, quien yo sigo
    //pero la prioridad se la da al parametro
    //para pruebas enviar el id propio del que se identifica
    let userId = req.user.id;

    //Comprobar si llego el id por parametrp en la url
    //se le da prioridad al id que viene por parametro, 
    //userId sera igual al id del parametro
   if(req.params.id) userId = req.params.id;

    //comprobar que llege el parametro paguina, si no la pagina 1
    let page = 1;
    //compruebo si viene por la url entonces page toma ese valor
    if(req.params.page) page = req.params.page;

    //cuantos usauarios por pagina quiero mostrar
    let itemsPerPage = 5;

    //Find a follow, popular datos de lols usuarios y paginar con mongoose paginate, usando el modelo
    Follow.find({ user: userId })
    .populate("user followed", "-password -role -__v")
    .paginate(page, itemsPerPage, async (error, follows, total) => {
        if(error || !follows) {
            return res.status(400).json({
                status: "error",
                message: "error al listar follwings",
                user: userId,
                error: error
              });
        }
        
        //sacar un array de ids de los usuarios que me siguen y los que sigo
        let followUserIds = await followService.followUserIds(req.user.id);

        return res.status(200).json({
            status: "success",
            message: "listado de usuarios que estoy siguiendo",
            follows,
            total,
            pages: Math.ceil(total/itemsPerPage),
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
          });
        
    })
    

}


/*
//listado de los que sigo, puedo identificarme por token 
//pero tiene prioridad el parametro de la url
const following = async (req, res) => {
    try {
        //id del token
      let userId = req.user.id;
        //si viene id por parametro tiene prioridad
      if (req.params.id) {
        userId = req.params.id;
      }
      //prueba envio mi propio id
      console.log(userId)
      let page = 1;
  
      if (req.params.page) {
        page = req.params.page;
      }
  
      let itemsPerPage = 5;
  
      const options = {
        page: page,
        limit: itemsPerPage,
        populate: {
          path: "user followed",
          select: "-password -role -__v",
        },
      };
  
      const result = await Follow.paginate({ user: userId }, options);
  
      if (!result) {
        return res.status(400).json({
          status: "error",
          message: "Error al listar following",
          user: userId,
        });
      }
  
      let followUserIds = await followService.followUserIds(req.user.id);
      console.log(followUserIds)
      
      return res.status(200).json({
        status: "success",
        message: "Listado de usuarios que estoy siguiendo",
        follows: result.docs,
        total: result.totalDocs,
        pages: result.totalPages,
        user_following: followUserIds.following,
        user_follow_me: followUserIds.followers,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error al obtener el listado de following",
        error,
      });
    }
  };
*/

// metodo para listar usuarios que me siguen (soy seguido o seguidores)
const followers = (req, res) => {

    let userId = req.user.id;

   if(req.params.id) userId = req.params.id;

    //comprobar que llege el parametro paguina, si no la pagina 1
    let page = 1;
    //compruebo si viene por la url entonces page toma ese valor
    if(req.params.page) page = req.params.page;

    //cuantos usauarios por pagina quiero mostrar
    let itemsPerPage = 5;

 //Find a follow, popular datos de lols usuarios y paginar con mongoose paginate, usando el modelo
    Follow.find({ followed: userId })
    .populate("user", "-password -role -__v")
    .paginate(page, itemsPerPage, async (error, follows, total) => {
        if(error || !follows) {
            return res.status(400).json({
                status: "error",
                message: "error al listar follwings",
                user: userId,
                error: error,
                follows: follows
              });
        }
        
        //sacar un array de ids de los usuarios que me siguen y los que sigo
        let followUserIds = await followService.followUserIds(req.user.id);

        return res.status(200).json({
            status: "success",
            message: "listado de usuarios que me siguen",
            follows,
            total,
            pages: Math.ceil(total/itemsPerPage),
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
          });
        
    })

}


// Exportar acciones
module.exports = {
  pruebaFollow,
  saveFollow,
  unFollow,
  following,
  followers
};