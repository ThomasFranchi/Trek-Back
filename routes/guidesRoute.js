const express = require('express');
const router = express.Router();
const guideCtrl = require("../controllers/guideCtrl");
const loginCtrl = require("../controllers/loginCtrl");
const mwToken = require('../middlewares/tokenMw');
const mwHasRoles = require("../middlewares/hasRolesMw");
const mwUploadImage = require("../middlewares/uploadImageMw");

router.get("/", mwToken, guideCtrl.getGuidesList);
router.put("/update", mwToken, mwUploadImage("guidePicture"), guideCtrl.updateGuide);
router.delete("/delete", mwToken, guideCtrl.deleteGuide);

router.get("/:slug", mwToken, guideCtrl.getSingleGuide);
router.get("/get/:id", mwToken, guideCtrl.getSingleGuideById);
router.get("/userinfos", mwToken, loginCtrl.getCurrentUser);

module.exports = router;