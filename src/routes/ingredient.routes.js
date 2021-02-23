const express = require('express');
const router = express.Router();
const { AuthMiddleware } = require("../middlewares");
const { IngredientController } = require('../controllers');
const ingredientController = new IngredientController();

router.get('/', ingredientController.getAll);
router.get('/:id(\\d+)/', ingredientController.getOneById);
router.post('/', AuthMiddleware, ingredientController.create);
router.put('/:id(\\d+)/', AuthMiddleware, ingredientController.update);
router.delete('/:id(\\d+)/', AuthMiddleware, ingredientController.delete);

module.exports = router;




