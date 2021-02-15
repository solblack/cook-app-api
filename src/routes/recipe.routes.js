const express = require("express");
let router = express.Router();
let { RecipeController } = require("../controllers");
const recipeController = new RecipeController();

router.get("/", recipeController.getAll);
router.get("/:id", recipeController.getOneById);
router.post("/", recipeController.create);
router.put("/:id", recipeController.update);
router.delete("/:id", recipeController.delete);

module.exports = router;
