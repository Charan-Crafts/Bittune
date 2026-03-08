const jwt = require('jsonwebtoken')

const accessToken = (payload)=>{

    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"1d"
    })

}

const verifyToken = (token)=>{

    const decode = jwt.verify(token,process.env.JWT_SECRET)

    return decode;
}

module.exports = {
    accessToken,
    verifyToken
}