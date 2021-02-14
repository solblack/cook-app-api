const express = require('express');
const router = express.Router();
const { IngredientController } = require('../controllers');
const ingredientController = new IngredientController();

router.get('/', ingredientController.getAll);

router.get('/:id(\\d+)/', ingredientController.getOneById);

router.post('/', ingredientController.create);

router.put('/:id(\\d+)/', ingredientController.update);

router.delete('/:id(\\d+)/', ingredientController.delete);

module.exports = router;




