const db = require('../models');
const {Op} = require('sequelize');
const Validator = require('validatorjs');
class IngredientController {

    constructor() {

    }

    /**
     * getAll - Show all ingredients
     * @param {*} req 
     * @param {*} res 
	 * @param {*} next
     */
    getAll = async (req, res, next) => {
        try {
            const ingredients = await db.Ingredient.findAll();
            res.status(200).json({ results: ingredients});
            
        } catch (err) {
            next(err);
        }

    }

    /**
     * getOneById - Show one ingredient
     * @param {*} req 
     * @param {*} res 
	 * @param {*} next
     */
    getOneById = async (req, res, next) => {
        try {
            const ingredient = await db.Ingredient.findByPk(req.params.id);
            if(!ingredient){
                const error = new Error('Bad request. Invalid ID');
                error.status = 400;
                throw error;
            }
            res.status(200).json(ingredient);
              
        } catch (err) {
            next(err);
        }

    }

    /**
     * create - create a new ingredient
     * @param {*} req 
     * @param {*} res 
	 * @param {*} next
     */
    create = async (req, res, next) => {

        const transaction = await db.sequelize.transaction();
        try {
            const rules = {
                name: 'required|between:3,100|string'
              };
              let validation = new Validator(req.body, rules);
              if(validation.fails()){
                const error = new Error('Validation error');
                error.errors = validation.errors.all();
                error.status = 400;
                throw error;
              }
            
            let ingredient = {
                name: req.body.name,
            };
            const newIngredient = await db.Ingredient.create(ingredient, { transaction });

            await transaction.commit();

            res.status(201).json(newIngredient);
        } catch (err) {
            await transaction.rollback();
            next(err);
        }

    }

    /**
     * update - update a ingredient
     * @param {*} req 
     * @param {*} res 
	 * @param {*} next
     */
    update = async (req, res, next) => {

        const transaction = await db.sequelize.transaction();
        try {
            const rules = {
                name: 'required|between:3,100|string'
              };
              let validation = new Validator(req.body, rules);
              if(validation.fails()){
                const error = new Error('Validation error');
                error.errors = validation.errors.all();
                error.status = 400;
                throw error;
              }

            const ingredient = await db.Ingredient.findByPk(req.params.id);
            if(!ingredient){
                const error = new Error('Bad request. Invalid ID');
                error.status = 400;
                throw error;
            }

            ingredient.name = req.body.name;
            await ingredient.save(transaction)

            await transaction.commit();
            res.status(200).json({message: `ingredient with id ${req.params.id} edited`});
            
        } catch (err) {
            await transaction.rollback();
            next(err);
        }

    }

    /**
     * delete - delete a ingredient
     * @param {*} req 
     * @param {*} res 
	 * @param {*} next
     */
    delete = async (req, res, next) => {
        try {
            const deleted = await db.Ingredient.destroy({
                where: {
                    id: req.params.id
                }
            });
            if(!deleted){
                const error = new Error('Bad request. Invalid ID');
                error.status = 400;
                throw error;
            }
            res.status(200).json({message: `ingredient with id ${req.params.id} deleted`});
            
        } catch (err) {
            next(err);
        }

    }

}

module.exports = IngredientController;
