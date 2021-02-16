const db = require("../models");
const { Op } = require("sequelize");
class RecipeController {
  constructor() {}

  /**
   * Get all recipes
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  getAll = async (req, res, next) => {
    try {
      const recipes = await db.Recipe.findAll({
        include: [
          {
            model: db.User,
            as: "user",
          },
        ],
      });
      res.status(200).json({ results: recipes });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Internal server error" });
    }
  };

  /**
   *  Get one recipe by id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  getOneById = async (req, res, next) => {
    try {
      const recipe = await db.Recipe.findByPk(req.params.id, {
        include: [
          {
            model: db.User,
            as: "user",
          },
        ],
      });
      res.status(200).json(recipe);
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Internal server error" });
    }
  };

  /**
   *  creates a recipe
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  create = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    try {
      let recipe = {
        title: req.body.title,
        description: req.body.description,
        user_id: req.body.user_id,
      };
      const newRecipe = await db.Recipe.create(recipe, { transaction });
      await transaction.commit();
      res.status(201).json(newRecipe);
    } catch (err) {
      await transaction.rollback();
      res
        .status(err.status || 500)
        .json({ message: err.message || "Internal server error" });
    }
  };

  /**
   * updates a recipe
   * @param {*} req
   * @param {*} res
   */
  update = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
      await db.Recipe.update(
        {
          title: req.body.title,
          description: req.body.description,
          user_id: req.body.user_id,
        },
        {
          where: {
            id: req.params.id,
          },
          transaction,
        }
      );

      const recipe = await db.Recipe.findByPk(req.params.id);

      await transaction.commit();
      res
        .status(200)
        .json({ message: `recipe with id ${req.params.id} edited`, recipe });
    } catch (err) {
      await transaction.rollback();
      res
        .status(err.status || 500)
        .json({ message: err.message || "Internal server error" });
    }
  };

  /**
   * Delete a product
   * @param {*} req
   * @param {*} res
   */
  delete = async (req, res, next) => {
    try {
      const deleteRecipe = await db.Recipe.destroy({
        where: {
          id: req.params.id,
        },
      });
      res
        .status(200)
        .json({ message: `recipe with id ${req.params.id} deleted` });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Internal server error" });
    }
  };

  /**
   * Add ingredient to recipe
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  addIngredient = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    try {
      // Validate IDs
      const ingredient = await db.Ingredient.findByPk(req.body.ingredient_id);
      if (!ingredient) {
        const error = new Error("Bad request. Invalid ingredient ID");
        error.status = 400;
        throw error;
      }
      const recipe = await db.Recipe.findByPk(req.params.recipeId);
      if (!recipe) {
        const error = new Error("Bad request. Invalid recipe ID");
        error.status = 400;
        throw error;
      }
      const unitMeasure = await db.UnitMeasure.findByPk(
        req.body.unit_measure_id
      );
      if (!unitMeasure) {
        const error = new Error("Bad request. Invalid unit measure ID");
        error.status = 400;
        throw error;
      }

      let recipeIngredient = {
        recipe_id: req.params.recipeId,
        ingredient_id: req.body.ingredient_id,
        quantity: req.body.quantity,
        unit_measure_id: req.body.unit_measure_id,
      };

      const newRecipeIngredient = await db.RecipeIngredient.create(
        recipeIngredient,
        { transaction }
      );
      await transaction.commit();
      res.status(200).json(newRecipeIngredient);
    } catch (error) {
      await transaction.rollback();
      res
        .status(error.status || 500)
        .json({ message: error.message || "Internal server error" });
    }
  };

  /**
   * Edit ingredient to recipe
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  editIngredient = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    try {
      // Validate IDs
      const unitMeasure = await db.UnitMeasure.findByPk(
        req.body.unit_measure_id
      );
      if (!unitMeasure) {
        const error = new Error("Bad request. Invalid unit measure ID");
        error.status = 400;
        throw error;
      }
      const recipeIngredientExists = await db.RecipeIngredient.findByPk(
        req.params.id
      );
      if (!recipeIngredientExists) {
        const error = new Error("Bad request. Invalid recipe ingredient ID");
        error.status = 400;
        throw error;
      }

      let recipeIngredient = {
        quantity: req.body.quantity,
        unit_measure_id: req.body.unit_measure_id,
      };

      await db.RecipeIngredient.update(recipeIngredient, {
        transaction,
        where: { id: req.params.id },
      });
      await transaction.commit();
      res
        .status(200)
        .json({
          message: `Recipe ingredient with id ${req.params.recipeId} edited`,
        });
    } catch (error) {
      await transaction.rollback();
      res
        .status(error.status || 500)
        .json({ message: error.message || "Internal server error" });
    }
  };

  /**
   * Delete ingredient from recipe
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteIngredient = async (req, res, next) => {
    try {
      // Validate IDs
      const recipeIngredient = await db.RecipeIngredient.findByPk(
        req.params.id
      );
      if (!recipeIngredient) {
        const error = new Error("Bad request. Invalid recipe ingredient ID");
        error.status = 400;
        throw error;
      }
       await db.RecipeIngredient.destroy({
        where: {
          id: req.params.id,
        },
      });
      res
        .status(200)
        .json({
          message: `Recipe ingredient with id ${req.params.recipeId} deleted`,
        });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Internal server error" });
    }
  };
}

module.exports = RecipeController;
