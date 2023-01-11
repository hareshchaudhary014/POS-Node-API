const { Router } = require("express");
const categoryController = require("../controller/categoryController");
// const { requireToken, checkRole } = require("../middleware/authMiddleWare");
const router = Router();

router.get("/api/categories", categoryController.getCategory);
// router.get('/api/categories/:id', categoryController.getCategoryById)
router.post("/api/categories", categoryController.addCategory);
router.put(
  "/api/categories/:id",
//   requireToken,
  categoryController.updateCategory
);
router.put(
    "/api/category/status/:slug",
  //   requireToken,
    categoryController.updateStatus
  );
router.delete(
  "/api/categories/:id",
//   requireToken,
  categoryController.deleteCategory
);

module.exports = router;
