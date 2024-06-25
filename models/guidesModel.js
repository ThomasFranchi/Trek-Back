const mongoose = require ("mongoose");

const guidesSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        mail: {type: String, unique: true, required: true}, 
        password: {type: String, required: true, select: false},
        description: {type: String, required: true},
        experienceYears: {type: Number, required: true},
        guidePicture: {type: String, required: true},
        state: {type: String, required: true},
        role: {type:String, required: true},
        slug: String
    }
)

module.exports = mongoose.model("guides", guidesSchema);