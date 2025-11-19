import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import adminGeneralRouter from './routes/adminGeneralRoute.js'
import canchaRouter from './routes/canchaRoute.js'
import userRouter from './routes/userRoute.js'

//app config
const app = express()
const port = process.env.PORT || 3000
connectDB()

//middlewares
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/admin-general', adminGeneralRouter)
app.use('/api/cancha', canchaRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
  res.send('API funcional')
})

app.listen(port, () => console.log('servidor corriendo en puerto ', port))
