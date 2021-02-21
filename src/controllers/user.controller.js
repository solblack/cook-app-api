const { AuthService } = require('../services');
class UserController {

    constructor(){
        this._authService = new AuthService();
    }

}
module.exports = UserController;