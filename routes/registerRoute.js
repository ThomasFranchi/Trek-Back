const express = require('express');
const router = express.Router();
const registerCtrl = require("../controllers/registerCtrl");
const mwToken = require('../middlewares/tokenMw');
const mwHasRoles = require("../middlewares/hasRolesMw");
const mwUploadImage = require("../middlewares/uploadImageMw");

router.post("/admin", mwToken, mwHasRoles("super-admin"), registerCtrl.registerAdmin);
router.post("/guide", mwToken, mwUploadImage("guidePicture"), mwHasRoles("super-admin", "admin"), registerCtrl.registerGuide);
router.post("/user", mwUploadImage("clientPicture"), registerCtrl.registerUser);

module.exports = router;