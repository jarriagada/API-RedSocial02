const {Schema, model, mongoose} = require("mongoose");
//mongoose.set('strictQuery', false);

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: String,
    bio: String,
    nick: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "role_user"
    },
    image: {
        type: String,
        default: "default.png"
    },
    create_at : {
        type: Date,
        default: Date.now
    }
})

//Se devuelve un model (para find, guardar objetos dentro, etc...)
//1° nombre del modelo, 2° el esquema, 3° opcional es que coleccion de datos quiero dejarlo.
//si no pasamos el tercer parametro el modelo, pasa a minuscula y pluraliza dejandolo como: users
//lo agrego para estar seguro, pero puedo asiganrle un nombre
module.exports = model("User", UserSchema, "users")



