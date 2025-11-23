import express from 'express'
import { canchaList } from '../controllers/canchaController.js'

const canchaRouter = express.Router()

canchaRouter.get('/lista', canchaList)

export default canchaRouter