const mongoose = require ("mongoose");

const tripsSchema = new mongoose.Schema(
    {
        beginDate: {type: Date, required: true},
        endDate: {type: Date, required: true},
        trekID: {type: mongoose.ObjectID, required: true},
        guideID: {type: mongoose.ObjectID, required: true},
        minPlaces: {type: Number, required: true},
        maxPlaces: {type: Number, required: true},
        bookings: [{
            userID: {type: mongoose.ObjectID, required: true},
            bookingDate: {type: Date, required: true}
        }]
    }
)

module.exports = mongoose.model("trips", tripsSchema);