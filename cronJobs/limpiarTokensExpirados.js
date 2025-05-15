import cron from 'node-cron'
import Veterinario from '../models/Veterinario.js';

const limpiarTokensExpirados = async () => {
    try {
        const ahora = new Date();
        const resultado = await Veterinario.updateMany(
            { tokenExpiracion: { $lt: ahora } }, // Tokens expirados
            { $set: { token: null, tokenExpiracion: null } } // Eliminar token
        )

        console.log(`Tokens expirados eliminados: ${resultado.modifiedCount}`)
    } catch (error) {
        console.error("Error al limpiar tokens expirados:", error)
    }
}

// Programar el cron job para ejecutarse cada hora
cron.schedule("* * * * *", limpiarTokensExpirados) // Ejecutar cada hora en el minuto 0

export default limpiarTokensExpirados;