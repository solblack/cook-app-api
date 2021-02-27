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

    login = async (req, res, next) => {
        try {
            const rules = {
                email: ['required', 'email'],
                password: ['required']
            };
            let validation = new Validator(req.body, rules);
            if (validation.fails()) {
              const error = new Error("Validation error");
              error.errors = validation.errors.all();
              error.status = 400;
              throw error;
            }
            let response = await this._authService.login(req.body);
            res.status(200).json(response);
            
        } catch (err) {
            next(err)
        }
    }

    setAdminRole = async (req, res, next) => {
        const transaction = await db.sequelize.transaction();
        try {
            const rules = {
                user_id: ['required', 'numeric'],
                is_admin: ['required', 'boolean']
            };
            let validation = new Validator(req.body, rules);
            if (validation.fails()) {
              const error = new Error("Validation error");
              error.errors = validation.errors.all();
              error.status = 400;
              throw error;
            }
            const user = await db.User.findByPk(req.body.user_id);

            if (user.id == req.user.id) {
                const error = new Error("A user cannot edit its role. Contact another admin user to make changes");
                error.status = 400;
                throw error;
            }

            if (user.is_admin == req.body.is_admin ) {
                const error = new Error(`User with id ${user.id} ${user.is_admin ? 'already has an admin role' : 'does not have an admin role to remove'}`);
                error.status = 400;
                throw error;
            }

            user.is_admin = req.body.is_admin;
            await user.save(transaction);
            await user.reload(transaction);

            await transaction.commit();
            res
              .status(200)
              .json({ message: `User with id ${req.body.user_id} ${ user.is_admin ? 'now has an admin role' : 'does not longer have an admin role'}` });      
        } catch (err) {
            await transaction.rollback();
            next(err)
        }
    }

}
module.exports = UserController;