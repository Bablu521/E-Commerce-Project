import path from 'path'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path:path.join(__dirname , "../../config/.env")})
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME , 
  api_key: process.env.API_KEY , 
  api_secret: process.env.API_SECRET ,
  secure:true
});

export default cloudinary