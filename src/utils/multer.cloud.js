import multer from "multer";

export const fileValidation = {
    image:["image/png" , "image/jpeg" , "image/gif"] ,
    file:["application/pdf" , "application/msword"]
}

export function fileUpload (customValidation=[]){
    const storage = multer.diskStorage({})
    function fileFilter (req,file,cb){
        if (customValidation.includes(file.mimetype)){
            cb (null , true)
        }else{
            cb (new Error("IN-VALID FILE FORMAT" , {cause:400}) , false)
        }
    }
    const upload = multer({fileFilter,storage})
    return upload
}