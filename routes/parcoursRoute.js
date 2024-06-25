const express = require('express');
const router = express.Router();
const parcoursCtrl = require("../controllers/parcoursCtrl");
const mwToken = require('../middlewares/tokenMw');
const mwHasRoles = require("../middlewares/hasRolesMw");
const mwUploadImage = require("../middlewares/uploadImageMw");

router.get("/", mwToken, parcoursCtrl.getParcoursList);
router.post("/add", mwToken, mwUploadImage("parcoursPicture"), mwHasRoles("admin", "super-admin"), parcoursCtrl.createParcours);
router.put("/update", mwToken, mwUploadImage("parcoursPicture"), mwHasRoles("admin", "super-admin"), parcoursCtrl.updateParcours);
router.delete("/delete", mwToken, mwHasRoles("admin", "super-admin"), parcoursCtrl.deleteParcours);

router.put("/addstep", mwToken, mwUploadImage("stepPicture"), mwHasRoles("admin", "super-admin"), parcoursCtrl.createStep);
router.put("/updatestep", mwToken, mwUploadImage("stepPicture"), mwHasRoles("admin", "super-admin"), parcoursCtrl.updateStep);
router.delete("/deletestep", mwToken, mwHasRoles("admin", "super-admin"), parcoursCtrl.deleteStep);

router.get("/:slug", mwToken, parcoursCtrl.getSingleParcours);
router.get("/get/:id", mwToken, parcoursCtrl.getSingleParcoursById);

router.get("/filter/:name", mwToken, parcoursCtrl.filterParcoursByName);
router.get("/duo/:difficulty/:price", mwToken, parcoursCtrl.duoFilter);


module.exports = router;