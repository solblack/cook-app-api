const express = require("express");
let router = express.Router();
let { RecipeController } = require("../controllers");
const recipeController = new RecipeController();

router.get("/", recipeController.getAll);
router.get("/:id", recipeController.getOneById);
router.post("/", recipeController.create);
router.put("/:id", recipeController.update);
router.delete("/:id", recipeController.delete);
router.post("/:recipeId/ingredients", recipeController.addIngredient);
router.put("/:recipeId/ingredients/:id", recipeController.editIngredient);
router.delete("/:recipeId/ingredients/:id", recipeController.deleteIngredient);

module.exports = router;
