const userService = require("../models/user.model")

const jwtToken = require("../utils/jwt.utils")

const bcryptJs = require("bcryptjs")

const register = async(req,res)=>{

    try {

        const {name,email,password , role} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Please provide all the required fields"
            })
        }

        const hashedPassword = await bcryptJs.hash(password,10)

        const existingUser = await userService.findOne({email})

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists with this email"
            })
        }

        const newUser = await userService.create({
            name,email,password:hashedPassword,role
        })

        const payload = {
            id:newUser._id,
            email:newUser.email,
            role:newUser.role
        }

        const token = jwtToken.accessToken(payload)

        return res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:payload,
            token
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const login = async(req,res)=>{

    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please provide email and password"
        })
    }

    try {

        const user = await userService.findOne({email})

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password"
            })
        }

        const isPasswordValid = await bcryptJs.compare(password,user.password)

        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password"
            })
        }
        
        const payload = {
            id:user._id,
            email:user.email,
            role:user.role
        }

        const token = jwtToken.accessToken(payload)

        return res.status(200).json({
            success:true,
            message:"User logged in successfully",
            data:payload,
            token
        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const userProfile = async(req,res)=>{

    try {

        const user = req.user;

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const userData = await userService.findById(user.id).select("-password")

        if(!userData){
            return res.status(404).json({
                success:false,
                message:'User not found'
            }
            )
        }

        return res.status(200).json({
            success:true,
            message:"User profile fetched successfully",
            data:userData
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const logout = async(req,res)=>{

    try {

        if(!req.user){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })  
        }

        return res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
module.exports = {
    register,
    login,
    userProfile,
    logout
}