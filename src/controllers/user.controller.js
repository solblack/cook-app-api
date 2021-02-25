const { AuthService } = require('../services');
const Validator = require("validatorjs");
const db = require("../models");
const { Op } = require("sequelize");
class UserController {

    constructor(){
        this._authService = new AuthService();
    }

    register = async (req, res, next) => {
        try {
            const rules = {
                name: ['required', 'between:3,45', 'regex:/^[a-zA-Z ]+$/'],
                lastname: ['required', 'between:3,100', 'regex:/^[a-zA-Z ]+$/'],
                email: ['required', 'between:3,100', 'email'],
                password: ['required', 'between:4,200']
            };
            let validation = new Validator(req.body, rules);
            if (validation.fails()) {
              const error = new Error("Validation error");
              error.errors = validation.errors.all();
              error.status = 400;
              throw error;
            }
            req.body.is_admin = 0;
            let response = await this._authService.register(req.body);
            res.status(201).json(response);  
        } catch (err) {
            next(err)
        }
    }

    login= async (req, res, next) => {
        try {
            let response = await this._authService.login(req.body);
            res.status(200).json(response);
            
        } catch (err) {
            next(err)
        }
    }

    setAdminRole = async (req, res, next) => {
        const transaction = await db.sequelize.transaction();
        try {
            const user = await db.User.findByPk(req.params.id);
            user.is_admin = req.body.is_admin;
            await user.save(transaction);

            await transaction.commit();
            res
              .status(200)
              .json({ message: `User with id ${req.params.id} edited`, user });      
        } catch (err) {
            await transaction.rollback();
            next(err)
        }
    }

}
module.exports = UserController;