const { AuthService } = require('../services');
const Validator = require("validatorjs");
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
                password: ['required', 'between:4,200'],
                is_admin: ['required', 'boolean'],
            };
            let validation = new Validator(req.body, rules);
            if (validation.fails()) {
              const error = new Error("Validation error");
              error.errors = validation.errors.all();
              error.status = 400;
              throw error;
            }
            
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

}
module.exports = UserController;