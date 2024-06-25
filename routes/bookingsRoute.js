const express = require('express');
const router = express.Router();
const bookingsCtrl = require("../controllers/bookingsCtrl");
const mwToken = require('../middlewares/tokenMw');
const mwHasRoles = require("../middlewares/hasRolesMw");

router.get("/", mwToken, bookingsCtrl.getBookingsList);
router.put("/add", mwToken, /*mwHasRoles("client"),*/ bookingsCtrl.addBooking);
router.get("/get/:id", mwToken, bookingsCtrl.getBookingsForUser);
router.get("/userbookings", mwToken, bookingsCtrl.getMyBookings);

module.exports = router;