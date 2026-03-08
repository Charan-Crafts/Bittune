const jwtToken = require("../utils/jwt.utils")

const authMiddleware = (req,res,next)=>{

    try {

        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]

        }

        if(!token){
            return res.status(401).json({
                success:false,
                message:"No token provided, authorization denied"
            })
        }

        const decode = jwtToken.verifyToken(token);

        req.user = decode;

        next()
        
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = authMiddleware