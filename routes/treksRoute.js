const express = require('express');
const router = express.Router();
const treksCtrl = require("../controllers/treksCtrl");
const mwToken = require('../middlewares/tokenMw');
const mwHasRoles = require("../middlewares/hasRolesMw");


router.get("/", mwToken, treksCtrl.getTreksList);
router.post("/add", mwToken, mwHasRoles("admin", "super-admin"), treksCtrl.createTrek);
router.put("/update", mwToken, mwHasRoles("admin", "super-admin"), treksCtrl.updateTrek);
router.get("/:slug", mwToken, treksCtrl.getSingleTrek);
router.get("/get/:slug", mwToken, treksCtrl.getTreksForParcours);
router.get("/list/:slug", mwToken, treksCtrl.getTrekListForGuide);
module.exports = router;