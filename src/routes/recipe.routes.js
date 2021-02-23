const express = require("express");
let router = express.Router();
const { AuthMiddleware } = require("../middlewares");
let { RecipeController } = require("../controllers");
const recipeController = new RecipeController();

router.get("/", recipeController.getAll);
router.get("/:id", recipeController.getOneById);
router.post("/", AuthMiddleware, recipeController.create);
router.put("/:id", AuthMiddleware, recipeController.update);
router.delete("/:id", AuthMiddleware, recipeController.delete);
router.post("/:recipeId/ingredients", AuthMiddleware, recipeController.addIngredient);
router.put("/:recipeId/ingredients/:id", AuthMiddleware, recipeController.editIngredient);
router.delete("/:recipeId/ingredients/:id", AuthMiddleware, recipeController.deleteIngredient);

module.exports = router;
