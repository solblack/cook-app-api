const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
       
        if(!token){
            const error = new Error('Access denied. A token is required');
            error.status = 401;
            throw error;
        }
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        const expired = tokenDecoded.exp < (new Date().getTime()) / 1000;

        if(expired){
            const error = new Error('Access denied. Expired token');
            error.status = 401;
            throw error;
        }
        next();
        
    } catch (error) {
        throw error;
    }

};