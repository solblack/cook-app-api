const db = require ("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class AuthService {

    login = async (loginData) => {
        try {
             /**
              * Find user in DB
              */
            const user = await db.User.findOne({ where: { email: loginData.email }});
            if(!user){
                const error = new Error('User does not exist');
                error.status = 400;
                throw error
            }
            
            /**
             * Check user password
             */
            const validUser = bcrypt.compareSync(loginData.password, user.password);
            if(!validUser){
                const error = new Error('Invalid password');
                error.status = 400;
                throw error
            }

            /**
             * Generate JWT
             */
            const userPayload = {
                id: user.id,
                email: user.email
            };
            const response = {
                user: userPayload,
                token: jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '4h' } )
            }
             return response;

            
        } catch (error) {
            throw error;
        }
    }
    
}
module.exports = AuthService;