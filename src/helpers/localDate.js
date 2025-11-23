// Convierte una fecha a hora local de El Salvador (UTC−06).
// Si ya viene con timezone, respeta ese timezone.
// Si no trae timezone, se le agrega.

export function parseFechaLocal(fechaString) {
    if (!fechaString) {
        throw new Error("La fecha es obligatoria");
    }

    // Si la fecha contiene un timezone explícito (-06:00 o Z)
    if (fechaString.includes("-") || fechaString.endsWith("Z")) {
        return new Date(fechaString);
    }

    // Si no trae timezone, se fuerza a UTC−06
    return new Date(fechaString + "-06:00");
}
