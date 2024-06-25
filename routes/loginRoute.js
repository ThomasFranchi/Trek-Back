const express = require('express');
const router = express.Router();
const loginCtrl = require("../controllers/loginCtrl");
const mwToken = require('../middlewares/tokenMw');

router.post("/admin", loginCtrl.loginAdmin);
router.post("/guide", loginCtrl.loginGuide);
router.post("/user", loginCtrl.loginUser);
router.get("/userinfos", mwToken, loginCtrl.getCurrentUser);

module.exports = router;