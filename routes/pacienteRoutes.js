// Importamos el módulo de express
import express from 'express'

// Importamos las funciones del controlador de pacientes
import {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
} from '../controllers/pacienteController.js';

// Importamos el middleware de autenticación
import checkAuth from '../middleware/authMiddleware.js'

// Creamos una instancia del enrutador de express
const router = express.Router()

// Definimos las rutas para la entidad "paciente"
// Ruta raíz ('/'):
// - POST: Agregar un paciente (requiere autenticación)
// - GET: Obtener la lista de pacientes (requiere autenticación)
router.route('/')
    .post(checkAuth, agregarPaciente) // Ruta para agregar un paciente
    .get(checkAuth, obtenerPacientes) // Ruta para obtener pacientes

router
    .route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)

// Exportamos el enrutador para que pueda ser utilizado en otras partes de la aplicación
export default router;