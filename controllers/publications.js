const publication = require("../models/publication");
const Publication = require("../models/publication");

//Acciones de prueba:
const pruebaPublications = (req, res) =>{
    return res.status(200).json({
        status: "success",
        message: "Desde PublicationController"
    })
} ;

//Metodos:

//Guardar publication
const save = (req, res) =>{
    //Recoger datos del body
    const params = req.body;
    //Si no llegan los datos dar respuesta negativa
    if(!params.text) {
        res.status(400).json({
            status: "error",
            message: "se debe enviar el texto de la publication"
        })
    }

    //Crear y rellenar el objeto del modelo
    let newPublication = new Publication(params)
    newPublication.user = req.user.id;

    //Guardar objeto en base de datos
    newPublication.save((error, publicationStored) => {

        if(error || !publicationStored){
            res.status(400).json({
                status: "error",
                message: "Error al guardar la publication"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "publication guardada",
            publicationStored
        })

    })

    
}

//obtener One publication
const detail = (req, res) => {
    //sacar el id de la publication de la url
    const publicationId = req.params.id;

    //find con la condicion del id, usando el modelo Publication
    Publication.findById(publicationId, (error, publicationStored ) => {

        if(error || !publicationStored){
            return res.status(404).json({
                status: "error",
                message: "Error al obtener la publication"
            }) 
        }

        return res.status(200).json({
            status: "success",
            message: "Publication obtenida",
            publication: publicationStored
        })

    })

};
/*
//eliminar publication
const remove = (req, res) => {
    //sacar el id de la publication a eliminar
    const publicationId = req.params.id;
    //find y remove, con el pudelo, publicaciones que solo sean nuestras
    Publication.find({ "user": req.user.id, "_id": publicationId }).remove(error = {
        if(error) {
            return res.status(500).json({
                status: "error",
                message: "No se ha eliminado la publication"
            });

        }

            return res.status(200).json({
            status: "success",
            message: "Publication obtenida",
            publication: publicationStored
        })
    });

};
*/
const remove = (req, res) => {
    // Sacar el id de la publicación a eliminar
    const publicationId = req.params.id;
    // Buscar y eliminar solo las publicaciones que sean nuestras
    Publication.findOneAndRemove({ user: req.user.id, _id: publicationId }, (error, publication) => {
        if (error) {
            return res.status(500).json({
                status: "error",
                message: "No se ha eliminado la publicación"
            });
        }
        if (!publication) {
            return res.status(404).json({
                status: "error",
                message: "No se ha encontrado la publicación"
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Publicación eliminada",
            publication: publication
        });
    });
};
/*
//listar publicaciones de un usuario
const user = (req, res) => {
    //sacar el id de usuario
    let userId = req.params.id;

    //controlar la pagina
    let page = 1;
    if(req.params.page) page = req.params.page;
    
    const itemsPerPage = 5;
    
    //find, populate, ordenar, paginar, usando el modelo y mongoose-pagination
    Publication.find({"user": userId})
        .sort("-create_at")
        .populate('user', '-password - __v')
        .paginate(page, itemsPerPage, (error, publications, total) => {



            //devolver resultado
            return res.status(200).json({
            status: "success",
            message: "publicaciones del perfil de un usuario",
            publications,
            page,
            total,
            pages: Math.ceil(total/itemsPerPage),
            publications,
            user: req.user
        });

    })
}
*/
const user = (req, res) => {
    // Sacar el id de usuario
    const userId = req.params.id;

    // Controlar la página
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    
    const itemsPerPage = 5;
    
    // Utilizar el método paginate del modelo Publication para buscar, ordenar y paginar las publicaciones
    Publication.find({ user: userId })
        .sort("-create_at")
        .populate('user', '-password -__v')
        .paginate(page, itemsPerPage, (error, publications, total) => {
            if (error || !publications) {
                return res.status(500).json({
                    status: "error",
                    message: "No hay publicaciones para mostrar"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Publicaciones del perfil de un usuario",
                publications: publications,
                page,
                total,
                pages: Math.ceil(total / itemsPerPage),
                user: req.user
            });
        });
}

//listar todas las publications

//Listar las publication de un usuario

//subir ficheros

//Devolver archivos multimedia imagenes



//Exportar acciones
module.exports ={ 
    pruebaPublications,
    save,
    detail,
    remove,
    user
};