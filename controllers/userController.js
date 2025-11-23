import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import canchaModel from '../models/canchaModel.js'
import jwt from 'jsonwebtoken'
import reservaModel from '../models/reservaModel.js'

//API para registrar usuario
const registrarUsuario = async (req, res) => {
    try {
        const {username, email, password} = req.body
        //validando
        if(!username || !password || !email){
            return res.json({success:false, message:"Datos Faltantes"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Introduce un correo válido"})
        }
        if(password.length < 8){
            return res.json({success:false, message:"Introduce una contraseña fuerte"})
        }
        //hasheando la password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            username,
            email,
            password: hashedPassword
        }
        const newUser = new userModel(userData)
        const user = await newUser.save()
        //token
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
        res.json({success:true, token})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API para login
const loginUsuario = async (req, res) => {
    try {
        const {email, password}= req.body
        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({success:false, message:'Credenciales Inválidas'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true, token})
        }else{
            res.json({success:false, message:"Credenciales Inválidas"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API para reservar cancha
const reservarCancha = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);
        const {userId, canchaId, espacioFecha, reservaHora} = req.body
        const canchaData = await canchaModel.findById(canchaId)
        if(!canchaData.disponible){
            return res.json({success:false, message:'Cancha no disponible'})
        }
        let espacios_reservados = canchaData.espacios_reservados
        if(espacios_reservados[espacioFecha]){
            if(espacios_reservados[espacioFecha].includes(reservaHora)){
                return res.json({success: false, message: "Espacio NO Disponible"})
            } else{
                espacios_reservados[espacioFecha].push(reservaHora)
            }
        }else{
            espacios_reservados[espacioFecha] = []
            espacios_reservados[espacioFecha].push(reservaHora)
        }
        const userData = await userModel.findById(userId).select('-password')
        delete canchaData.espacios_reservados //Lo eliminamos porque no queremos que se muestre en la reserva del usuario

        const reservaData = {
            userId,
            canchaId,
            userData,
            canchaData,
            precio: canchaData.precioHora,
            reservaHora,
            espacioFecha,
            fecha: Date.now()
        }
        const newReserva = new reservaModel(reservaData)
        await newReserva.save()

        await canchaModel.findByIdAndUpdate(canchaId, {espacios_reservados})
        res.json({success:true, message:'Cancha Reservada'})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//API para obtener las reservas del usuario en 'mis-reservas'
/**
 * Lista las reservas de un usuario autenticado.
 * Endpoint: GET /mis-reservas
 * Requiere: authUser middleware
 * Retorna: JSON con las reservas ordenadas de más reciente a más antiguo
 * Campos mínimos: fecha, reservaHora, centro deportivo (canchaData.nombre)
 */
const listaReservas = async (req, res) => {
    try {
        const { userId } = req.body;

        // Orden descendente: más recientes primero
        let reservas = await reservaModel.find({ userId })
            .select('espacioFecha reservaHora canchaData cancelado fecha');
        reservas = reservas.reverse();

        res.json({ success: true, reservas });
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


//API para cancelar reservas del propio usuario
const cancelarReserva = async (req, res) => {
    try {
        const { userId, reservaId } = req.body;
        const reservaData = await reservaModel.findById(reservaId);
        if (!reservaData) {
            return res.json({ success: false, message: "Reserva no encontrada" });
        }
        // Corrección principal
        if (reservaData.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Acción NO Autorizada" });
        }
        // Cancelar reserva
        await reservaModel.findByIdAndUpdate(reservaId, { cancelado: true });
        // Liberar espacio en la cancha
        const { canchaId, espacioFecha, reservaHora } = reservaData;
        const canchaData = await canchaModel.findById(canchaId);
        let espacios_reservados = canchaData.espacios_reservados;
        espacios_reservados[espacioFecha] = espacios_reservados[espacioFecha].filter(h => h !== reservaHora);
        await canchaModel.findByIdAndUpdate(canchaId, { espacios_reservados });
        return res.json({ success: true, message: "Reserva Cancelada" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export {registrarUsuario, loginUsuario, reservarCancha, listaReservas, cancelarReserva}
