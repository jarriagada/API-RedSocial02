const {Schema, model, mongoose} = require("mongoose");
//mongoose.set('strictQuery', false);

const FollowSchema = Schema({
    //referencia a otro objeto. al follow
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    //Followed, el usaurio que esta siendo seguido
    followed: {
        type: Schema.ObjectId,
        ref: "User"
    },
    create_at : {
        type: Date,
        default: Date.now
    }

})

module.exports = model("Follow", FollowSchema, "follows");