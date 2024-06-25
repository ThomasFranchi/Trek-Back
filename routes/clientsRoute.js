const express = require('express');
const router = express.Router();
const clientsCtrl = require("../controllers/clientCtrl");
const loginCtrl = require("../controllers/loginCtrl");
const mwToken = require('../middlewares/tokenMw');
const mwHasRoles = require("../middlewares/hasRolesMw");
const mwUploadImage = require("../middlewares/uploadImageMw");

router.get("/", mwToken, clientsCtrl.getClientsList);
router.put("/updateadmin", mwToken, mwUploadImage("clientPicture"), clientsCtrl.updateClient);
router.put("/update", mwToken, mwUploadImage("clientPicture"), clientsCtrl.updateClient);
router.delete("/delete", mwToken, mwHasRoles("client", "admin", "super-admin"), clientsCtrl.deleteClient);
router.get("/:slug", mwToken, clientsCtrl.getSingleClient);
router.get("/get/:id", mwToken, clientsCtrl.getSingleClientById);
router.get("/userinfos", mwToken, loginCtrl.getCurrentUser);

module.exports = router;