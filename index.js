import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import initApp from './src/index.router.js'
import express from 'express'
const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
const port = process.env.PORT || 5000

initApp(app, express)

app.listen(port, () => console.log(`SERVER IS RUNNING ON PORT ${port}`))