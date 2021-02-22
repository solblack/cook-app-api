const db = require ("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class AuthService {

    register = async (registerData) => {
        try {

            const user = await db.User.findOne({ where: { email: registerData.email }});
            if(user){
                throw new Error('User exists');
            }
            
            registerData.password = bcrypt.hashSync(registerData.password, 10);

            const newUser = await db.User.create(registerData);

            const userPayload = {
                id: newUser.id,
                email: newUser.email
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