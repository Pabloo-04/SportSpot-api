import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import canchaModel from '../models/canchaModel.js'
import jwt from 'jsonwebtoken'
import reservaModel from '../models/reservaModel.js'
import userModel from '../models/userModel.js'

//API para agregar cancha
const addCancha = async(req, res) => {
    try{
        const {name, lugar, lugar_id, direccion, deporte, descripcion, capacidad, precioHora} = req.body

        if(!name, !lugar, !lugar_id, !direccion, !deporte, !descripcion, !capacidad, !precioHora){
            return res.json({success: false, message: "Detalles Faltantes"})
        }
        


        const canchaData = {
            name,
            lugar,
            lugar_id,
            direccion,
            deporte,
            descripcion,
            capacidad,
            precioHora,
            fecha: Date.now()
        }
        const newCancha = new canchaModel(canchaData)
        await newCancha.save()
        res.json({success:true, message:"Cancha Agregada"})
    } catch (error){
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

//API para login de admin general
const loginAdminGeneral= async(req, res) => {
    try {
        const {email, password} = req.body 
        if(email == process.env.ADMIN_GENERAL_EMAIL && password == process.env.ADMIN_GENERAL_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true, token})
        } else{
            res.json({success: false, message: "Credenciales Inválidas"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

//API para conseguir los datos de todas las cnachas
const canchasTodas = async (req, res) => {
    try {
        const canchas = await canchaModel.find({})
        res.json({success:true, canchas})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const cambiarDisponibilidad = async (req, res) => {
    try {
        const {canchaId} = req.body
        const canchaData = await canchaModel.findById(canchaId)
        await canchaModel.findByIdAndUpdate(canchaId,{disponible: !canchaData.disponible})
        res.json({success:true, message: 'Disponibilidad Cambiada'})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//API para obtener la lista de la reservas
const reservasAdmin = async (req, res) => {
    try {
        const reservas = await reservaModel.find({})
        res.json({success:true, reservas})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const cancelarReserva = async (req, res) => {
    try {
       const {reservaId} = req.body
       const reservaData = await reservaModel.findById(reservaId)
       await reservaModel.findByIdAndUpdate(reservaId, {cancelado: true})
       const {canchaId, espacioFecha, reservaHora} = reservaData
       const canchaData = await canchaModel.findById(canchaId)
       let espacios_reservados = canchaData.espacios_reservados
       espacios_reservados[espacioFecha] = espacios_reservados[espacioFecha].filter(e => e !== reservaHora)
       await canchaModel.findByIdAndUpdate(canchaId, {espacios_reservados})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}


export {addCancha, loginAdminGeneral, canchasTodas, cambiarDisponibilidad, reservasAdmin, cancelarReserva}