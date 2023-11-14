
const{Schema, model} = require("mongoose");

const publicationsSchema = Schema({

    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    },
    file: String,
    create_at: {
        type: Date,
        default: Date.Now
    }

});

module.exports = model("Publication", publicationsSchema, "publications");
