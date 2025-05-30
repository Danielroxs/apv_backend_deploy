import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'
import limpiarTokensExpirados from './cronJobs/limpiarTokensExpirados.js'

const app = express()
app.use(express.json())

dotenv.config()

// Conectar a la BD
conectarDB()

const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            // El origen del Request esta permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions))

app.use("/api/veterinarios", veterinarioRoutes)
app.use("/api/pacientes", pacienteRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor funcionando el puerto ${PORT}`)
})