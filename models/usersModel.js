const mongoose = require ("mongoose");

const usersSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        mail: {type: String, unique: true, required: true}, 
        password: {type: String, required: true, select: false},
        clientPicture: {type: String, required: true},
        role: {type: String, required: true},
        slug: String
    }
)

module.exports = mongoose.model("users", usersSchema);