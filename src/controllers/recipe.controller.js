const db = require("../models");
const { Op } = require("sequelize");
const Validator = require("validatorjs");
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
            model: db.RecipeIngredient,
            as: "ingredients",
            include: [
              { model: db.Ingredient, as: "ingredient" },
              { model: db.UnitMeasure, as: "unit_measure" },
            ],
          },
        ],
      });
      res.status(200).json({ results: recipes });
    } catch (err) {
      next(err);
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
            model: db.RecipeIngredient,
            as: "ingredients",
            include: [
              { model: db.Ingredient, as: "ingredient" },
              { model: db.UnitMeasure, as: "unit_measure" },
            ],
          },
        ],
      });
      if (!recipe) {
        const error = new Error("Bad request. Invalid ID");
        error.status = 400;
        throw error;
      }
      res.status(200).json(recipe);
    } catch (err) {
      next(err);
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
      const rules = {
        title: "required|between:3,100|string",
        description: ["required", "between:10,10000", "string"],
        user_id: "required|numeric",
      };
      let validation = new Validator(req.body, rules);
      if (validation.fails()) {
        const error = new Error("Validation error");
        error.errors = validation.errors.all();
        error.status = 400;
        throw error;
      }

      let recipe = {
        title: req.body.title,
        description: req.body.description,
        user_id: req.body.user_id,
      };
      const user = await db.User.findByPk(req.body.user_id);
      if (!user) {
        const error = new Error("Bad request. Invalid user ID");
        error.status = 400;
        throw error;
      }
      const newRecipe = await db.Recipe.create(recipe, { transaction });
      await transaction.commit();
      res.status(201).json(newRecipe);
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  };

  /**
   * updates a recipe
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  update = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    try {
      const rules = {
        title: "required|between:3,100|string",
        description: ["required", "between:10,10000", "string"],
        user_id: "required|numeric",
      };
      let validation = new Validator(req.body, rules);
      if (validation.fails()) {
        const error = new Error("Validation error");
        error.errors = validation.errors.all();
        error.status = 400;
        throw error;
      }
      const recipe = await db.Recipe.findByPk(req.params.id, {
        include: [
          {
            model: db.RecipeIngredient,
            as: "ingredients",
            include: [
              { model: db.Ingredient, as: "ingredient" },
              { model: db.UnitMeasure, as: "unit_measure" },
            ],
          },
        ],
      });

      if (!recipe) {
        const error = new Error("Bad request. Invalid ID");
        error.status = 400;
        throw error;
      }
      recipe.title = req.body.title;
      recipe.description = req.body.description;
      recipe.user_id = req.body.user_id;
      await recipe.save(transaction);
      await recipe.reload(transaction);

      await transaction.commit();
      res
        .status(200)
        .json({ message: `Recipe with id ${req.params.id} edited`, recipe });
    } catch (err) {
      await transaction.rollback();
      next(err);
    }
  };

  /**
   * Delete a recipe
   * @param {*} req
   * @param {*} res
   */
  delete = async (req, res, next) => {
    try {
      const recipe = await db.Recipe.findByPk(req.params.id);

      if (!recipe) {
        const error = new Error("Bad request. Invalid ID");
        error.status = 400;
        throw error;
      }

      const deleteRecipe = await db.Recipe.destroy({
        where: {
          id: req.params.id,
        },
      });

      res
        .status(200)
        .json({ message: `Recipe with id ${req.params.id} deleted` });
    } catch (err) {
      next(err);
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
      const rules = {
        ingredient_id: "required|numeric",
        quantity: "required|between:0,10000|numeric",
        unit_measure_id: "required|numeric",
      };
      1;

      let validation = new Validator(req.body, rules);
      if (validation.fails()) {
        const error = new Error("Validation error");
        error.errors = validation.errors.all();
        error.status = 400;
        throw error;
      }

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
    } catch (err) {
      await transaction.rollback();
      next(err);
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
      const rules = {
        quantity: "required|between:0,10000|numeric",
        unit_measure_id: "required|numeric",
      };
      1;

      let validation = new Validator(req.body, rules);
      if (validation.fails()) {
        const error = new Error("Validation error");
        error.errors = validation.errors.all();
        error.status = 400;
        throw error;
      }
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
      res.status(200).json({
        message: `Recipe ingredient with id ${req.params.recipeId} edited`,
      });
    } catch (err) {
      await transaction.rollback();
      next(err);
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
      res.status(200).json({
        message: `Recipe ingredient with id ${req.params.recipeId} deleted`,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = RecipeController;
