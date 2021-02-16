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
      if(!recipe){
        const error = new Error('Bad request. Invalid ID');
        error.status = 400;
        throw error;
      }
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
      const recipe = await db.Recipe.findByPk(req.params.id);

      if(!recipe){
        const error = new Error('Bad request. Invalid ID');
        error.status = 400;
        throw error;
      }

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

      await transaction.commit();
      res
        .status(200)
        .json({ message: `product with id ${req.params.id} edited`, recipe });
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
      const recipe = await db.Recipe.findByPk(req.params.id);

      if(!recipe){
        const error = new Error('Bad request. Invalid ID');
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
        .json({ message: `product with id ${req.params.id} deleted` });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Internal server error" });
    }
  };
}

module.exports = RecipeController;
