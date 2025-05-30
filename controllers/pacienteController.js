import Paciente from '../models/Paciente.js'

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;

    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find()
        .where('veterinario')
        .equals(req.veterinario._id || req.veterinario);

    res.json(pacientes)
}

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    if (String(paciente.veterinario._id) !== String(req.veterinario._id)) {
        return res.status(401).json({ msg: 'Acción no válida' });
    }

    res.json(paciente)

}

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    if (String(paciente.veterinario._id) !== String(req.veterinario._id)) {
        return res.status(401).json({ msg: 'Acción no válida' });
    }

    // Actualizar Paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save()
        res.json(pacienteActualizado)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Error al actualizar el paciente' });
    }

}
const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    if (String(paciente.veterinario._id) !== String(req.veterinario._id)) {
        return res.status(401).json({ msg: 'Acción no válida' });
    }

    try {
        await paciente.deleteOne()
        res.json({ msg: "Paciente Eliminado" })
    } catch (error) {
        console.log(error)
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}