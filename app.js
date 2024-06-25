require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const mwCORS = require('./middlewares/corsMw');
// const mwToken = require('./middlewares/tokenMw');
const loginRoute = require("./routes/loginRoute");
const registerRoute = require("./routes/registerRoute");
const parcoursRoute = require("./routes/parcoursRoute");
const treksRoute = require("./routes/treksRoute");
const guidesRoute = require("./routes/guidesRoute");
const clientsRoute = require("./routes/clientsRoute");
const bookingsRoute = require("./routes/bookingsRoute");
const path = require("path");

// require(".//dbConnect/connect");

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(mwCORS);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/register", registerRoute);
app.use("/login", loginRoute);

app.use("/parcours", parcoursRoute);
app.use("/treks", treksRoute);
app.use("/guides",  guidesRoute);
app.use("/clients", clientsRoute);
app.use("/bookings", bookingsRoute);

module.exports = app;