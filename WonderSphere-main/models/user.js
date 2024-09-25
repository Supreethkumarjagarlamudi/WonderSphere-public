const mongoose = require("mongoose");
const user = mongoose.Schema;
const passportMongoose = require("passport-local-mongoose");
const userSchema = new user({
    email: {
        type: String,
        required: true
    },
});

userSchema.plugin(passportMongoose);

module.exports = mongoose.model("user", userSchema);