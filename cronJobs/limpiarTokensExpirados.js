import cron from 'node-cron'
import Veterinario from '../models/Veterinario.js';

const limpiarTokensExpirados = async () => {
    try {
        const ahora = new Date();
        const batchSize = 100; // Tamaño del lote
        let documentosActualizados;

        do {
            documentosActualizados = await Veterinario.updateMany(
                { tokenExpiracion: { $lt: ahora } }, // Tokens expirados
                { $set: { token: null, tokenExpiracion: null } }, // Eliminar token
                { limit: batchSize } // Procesar en lotes
            );

            console.log(`Tokens expirados eliminados: ${documentosActualizados.modifiedCount}`);
        } while (documentosActualizados.modifiedCount > 0);
    } catch (error) {
        console.error("Error al limpiar tokens expirados:", error);
    }
}

// Programar el cron job para ejecutarse cada hora
cron.schedule("* * * * *", limpiarTokensExpirados) // Ejecutar cada hora en el minuto 0

export default limpiarTokensExpirados;