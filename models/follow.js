
const mongoose = require("mongoose");

const FollowSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  followed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  create_at : {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Follow", FollowSchema);



/*
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
*/