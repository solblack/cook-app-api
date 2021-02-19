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
			next(error);
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
      next(err);
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
        .json({ message: `product with id ${req.params.id} edited`, recipe });
    } catch (err) {
      await transaction.rollback();
      next(err);
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
        .json({ message: `product with id ${req.params.id} deleted` });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = RecipeController;
