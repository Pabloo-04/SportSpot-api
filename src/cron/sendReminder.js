import cron from "node-cron";
import reservaModel from "../models/reservaModel.js";
import { transporter } from "../config/mailer.js";
import { reminderTemplate } from "../helpers/emailTemplate.js";
import { parseFechaLocal } from "../helpers/localDate.js";

export function startReminderCron() {

    cron.schedule("* * * * *", async () => {

        // Hora local exacta
        const ahora = parseFechaLocal(
            new Date().toISOString().split(".")[0]
        );

        const en24h = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
        const en24hYUnMin = new Date(en24h.getTime() + 60 * 1000);

        console.log("Hora local actual:", ahora.toString());
        console.log("Buscando reservas entre:", en24h.toString(), "y", en24hYUnMin.toString());

        try {
            const reservas = await reservaModel.find({
                fecha: { $gte: en24h, $lt: en24hYUnMin },
                cancelado: false,
                completada: false,
                recordatorioEnviado: false
            });

            if (reservas.length === 0) {
                console.log("No hay reservas para notificar");
                return;
            }

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

                console.log("Recordatorio enviado a:", reserva.userData.email);
            }

        } catch (error) {
            console.error("Error en cron:", error);
        }
    });
}
