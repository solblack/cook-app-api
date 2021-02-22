const { AuthService } = require('../services');
class UserController {

    constructor(){
        this._authService = new AuthService();
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