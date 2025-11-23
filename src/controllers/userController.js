import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import canchaModel from "../models/canchaModel.js";
import jwt from "jsonwebtoken";
import reservaModel from "../models/reservaModel.js";
import { parseFechaLocal } from "../helpers/localDate.js";

// Registrar usuario
const registrarUsuario = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !password || !email) {
            return res.json({ success: false, message: "Datos Faltantes" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Introduce un correo válido" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Introduce una contraseña fuerte" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ username, email, password: hashedPassword });
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Login usuario
const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Credenciales Inválidas" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Credenciales Inválidas" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Reservar cancha
const reservarCancha = async (req, res) => {
    try {
        const { userId, canchaId, espacioFecha, reservaHora, fecha } = req.body;

        if (!fecha) {
            return res.json({ success: false, message: "La fecha de la reserva es obligatoria" });
        }

        const fechaLocal = parseFechaLocal(fecha);

        const canchaData = await canchaModel.findById(canchaId);
        if (!canchaData.disponible) {
            return res.json({ success: false, message: "Cancha no disponible" });
        }

        let espacios_reservados = canchaData.espacios_reservados || {};

        if (!espacios_reservados[espacioFecha]) {
            espacios_reservados[espacioFecha] = [];
        }

        if (espacios_reservados[espacioFecha].includes(reservaHora)) {
            return res.json({ success: false, message: "Espacio NO Disponible" });
        }

        espacios_reservados[espacioFecha].push(reservaHora);

        const userData = await userModel.findById(userId).select("-password");

        const reservaData = {
            userId,
            canchaId,
            userData,
            canchaData,
            precio: canchaData.precioHora,
            reservaHora,
            espacioFecha,
            fecha: fechaLocal,
            cancelado: false,
            completada: false,
            recordatorioEnviado: false
        };

        const newReserva = new reservaModel(reservaData);
        await newReserva.save();

        await canchaModel.findByIdAndUpdate(canchaId, { espacios_reservados });

        res.json({ success: true, message: "Cancha reservada correctamente" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Mis reservas
const listaReservas = async (req, res) => {
    try {
        const { userId } = req.body;

        const reservas = await reservaModel.find({ userId });
        res.json({ success: true, reservas });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Cancelar reserva
const cancelarReserva = async (req, res) => {
    try {
        const { userId, reservaId } = req.body;

        const reservaData = await reservaModel.findById(reservaId);
        if (!reservaData) {
            return res.json({ success: false, message: "La reserva no existe" });
        }

        if (reservaData.userId !== userId) {
            return res.json({ success: false, message: "Acción NO Autorizada" });
        }

        await reservaModel.findByIdAndUpdate(reservaId, { cancelado: true });

        const canchaData = await canchaModel.findById(reservaData.canchaId);
        let espacios_reservados = canchaData.espacios_reservados;

        espacios_reservados[reservaData.espacioFecha] =
            espacios_reservados[reservaData.espacioFecha].filter(h => h !== reservaData.reservaHora);

        await canchaModel.findByIdAndUpdate(reservaData.canchaId, { espacios_reservados });

        res.json({ success: true, message: "Reserva cancelada" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    registrarUsuario,
    loginUsuario,
    reservarCancha,
    listaReservas,
    cancelarReserva
};
