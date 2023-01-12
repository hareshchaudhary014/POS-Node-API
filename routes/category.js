const { Router } = require("express");
const categoryController = require("../controller/categoryController");
const { requireToken, checkRole } = require("../middlewares/authorization");
const router = Router();

router.get("/api/categories", requireToken, categoryController.getCategory);
// router.get('/api/categories/:id', categoryController.getCategoryById)
router.post("/api/categories", categoryController.addCategory);
router.put(
  "/api/category/:slug",
  requireToken,
  categoryController.updateCategory
);
router.put(
  "/api/category/status/:slug",
  requireToken,
  categoryController.updateStatus
);
router.delete(
  "/api/categories/:id",
    requireToken,
  categoryController.deleteCategory
);

module.exports = router;
