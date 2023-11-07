const mongoose = require("mongoose");

const connection = async() => {

    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/mi_redsocial");

        console.log("conecta a mongoDB");

    } catch(error){
        console.log(error);
        throw new Error("No se ha podido conectar a la bas e de datos");
    }
}

module.exports = {
    connection
}