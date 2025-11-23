import express from 'express'
import {addCancha, canchasTodas, loginAdminGeneral, cambiarDisponibilidad, reservasAdmin, cancelarReserva} from '../controllers/adminGeneralController.js'
import upload from '../middleware/multer.js'
import authAdminGeneral from '../middleware/authAdminGeneral.js'

const adminGeneralRouter = express.Router()

adminGeneralRouter.post('/agregar-cancha', authAdminGeneral, upload.single('image'), addCancha)
adminGeneralRouter.post('/login', loginAdminGeneral)
adminGeneralRouter.post('/todas-canchas', authAdminGeneral, canchasTodas)
adminGeneralRouter.post('/cambiar-disponibilidad', authAdminGeneral, cambiarDisponibilidad)
adminGeneralRouter.get('/ver-reservas', authAdminGeneral, reservasAdmin)
adminGeneralRouter.post('/cancelar-reserva', authAdminGeneral, cancelarReserva)

export default adminGeneralRouter
