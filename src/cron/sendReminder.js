import cron from "node-cron";
import { reminderTemplate } from "../helpers/emailTemplate.js";
import reservaModel from "../models/reservaModel.js";
import { transporter } from "../config/mailer.js";

cron.schedule("* * * * *", async () => {
    const ahora = new Date();
    const en24h = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
    const en24hYUnMin = new Date(en24h.getTime() + 60 * 1000); // margen 1 minuto

    try {
        const reservas = await reservaModel.find({
            fecha: { $gte: en24h, $lt: en24hYUnMin },
            cancelado: false,
            completada: false,
            recordatorioEnviado: false
        });

        for (const reserva of reservas) {
            const mailOptions = {
                from: "SportSpot <noreply@sportspot.com>",
                to: reserva.userData.email,
                subject: "Recordatorio de tu reserva — SportSpot",
                html: reminderTemplate(reserva),
            };

            await transporter.sendMail(mailOptions);

            reserva.recordatorioEnviado = true;
            await reserva.save();

            console.log(`Recordatorio enviado a ${reserva.userData.email}`);
        }

    } catch (error) {
        console.error("Error en recordatorio:", error);
    }
});
