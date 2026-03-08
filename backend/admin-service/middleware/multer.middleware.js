const multer = require("multer")

const fs = require('fs')

const path = require("path")

const uploadDir = path.join(__dirname,"../temp/uploads")

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true})
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadDir)
    },
    filename:(req,file,cb)=>{
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null,fileName)
    }
})

const upload = multer({storage})

module.exports= upload;