export const reminderTemplate = (reserva) => {
    return `
        <h2>Hola ${reserva.userData.username},</h2>

        <p>Este es un recordatorio de tu reserva en SportSpot.</p>

        <ul>
            <li><b>Cancha:</b> ${reserva.canchaData.name}</li>
            <li><b>Fecha:</b> ${reserva.espacioFecha}</li>
            <li><b>Hora:</b> ${reserva.reservaHora}</li>
            <li><b>Dirección:</b> ${reserva.canchaData.direccion}</li>
        </ul>

        <p>¡Te esperamos! ⚽🏀</p>
    `;
};
