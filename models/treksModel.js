const mongoose = require ("mongoose");

const treksSchema = new mongoose.Schema(
    {
        trekName : {type: String, required: true},
        beginDate: {type: Date, required: true},
        endDate: {type: Date, required: true},
        parcoursID: {type: mongoose.Schema.Types.ObjectId, required: true},
        guideID: {type: mongoose.Schema.Types.ObjectId, required: true},
        minPlaces: {type: Number, required: true},
        maxPlaces: {type: Number, required: true},
        trekState: {type: String, required: true},
        slug: String,
        bookings: [{
            userID: {type: mongoose.Schema.Types.ObjectId, required: true},
            bookingDate: {type: Date, required: true},
            state: {type: String, required: true}
        }]
    }
)

module.exports = mongoose.model("treks", treksSchema);