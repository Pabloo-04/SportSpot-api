import express from 'express'
import { loginUsuario, registrarUsuario, reservarCancha, listaReservas, cancelarReserva } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'

const userRouter = express.Router()

userRouter.post('/registrar', registrarUsuario)
userRouter.post('/login', loginUsuario)
userRouter.post('/reservar-cancha',authUser, reservarCancha)
userRouter.get('/mis-reservas', authUser ,listaReservas)
userRouter.post('/cancelar-reserva', authUser, cancelarReserva)


export default userRouter
