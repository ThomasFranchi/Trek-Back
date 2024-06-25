const mongoose = require ("mongoose");

const adminsSchema = new mongoose.Schema(
    {
        mail: {type: String, unique: true, required: true}, 
        password: {type: String, required: true, select: false},
        role: {type: String, required: true},
        slug: String
    }
)

module.exports = mongoose.model("admins", adminsSchema);