const { Router } = require("express");
const router = Router();
const stockController = require("../controller/stockController");
const { requireToken, checkRole } = require("../middlewares/authorization");
router.post(
  "/api/stocks",
requireToken,
  stockController.addUniversity
);
router.get("/api/universities", stockController.getUniversity);
router.get("/api/universities/:id", stockController.getUniversityById);
router.put(
  "/api/universities/:id",
requireToken,
  stockController.editUniversity
);
router.delete("/api/universities/:id", stockController.deleteUniversity);
router.delete("/api/location/:id", stockController.deleteLocation);
router.put("/api/location/:id", stockController.editLocation);
router.put("/api/course/:id", stockController.editCourse);
router.delete("/api/program/:id", stockController.deleteCourse);
module.exports = router;
