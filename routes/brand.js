const { Router } = require("express");
const brandController = require("../controller/brandController");
// const { requireToken, checkRole } = require("../middleware/authMiddleWare");
const router = Router();

router.get("/api/brands", brandController.getBrand);
// router.get('/api/brands/:id', brandController.getBrandById)
router.post("/api/brands", brandController.addBrand);
router.put(
  "/api/brands/:id",
//   requireToken,
  brandController.updateBrand
);
router.put(
  "/api/brand/status/:slug",
//   requireToken,
  brandController.updateStatus
);
router.delete(
  "/api/brands/:id",
//   requireToken,
  brandController.deleteBrand
);

module.exports = router;
