import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailregistro from "../helpers/emailregistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

// Función para registrar un nuevo veterinario
const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    const existeUsuario = await Veterinario.findOne({ email: email });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email
        emailregistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
};

// Función para obtener el perfil del veterinario autenticado
const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
};

// Función para confirmar un usuario mediante un token
const confirmar = async (req, res) => {
    const { token } = req.params;

    // Buscar al usuario por el token
    const usuarioConfirmar = await Veterinario.findOne({ token });

    // Caso 1: Token no válido
    if (!usuarioConfirmar) {
        const error = new Error("Token no valido")
        return res.status(404).json({ msg: error.message })
    }

    try {
        /* usuarioConfirmar.token = null; */ // Eliminar el token
        usuarioConfirmar.confirmado = true; // Marcar como confirmado
        await usuarioConfirmar.save();

        res.json({ msg: "Usuario confirmado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

// Función para autenticar un usuario
const autenticar = async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Veterinario.findOne({ email });

    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            confirmado: usuario.confirmado,
            token: generarJWT(usuario.id), // Generar el token
        });
    } else {
        const error = new Error('El Password es incorrecto');
        return res.status(403).json({ msg: error.message });
    }
};

// Función para manejar el caso de "olvidé mi contraseña"
const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email: email });
    if (!existeVeterinario) {
        const error = new Error('El usuario no existe');
        return res.status(401).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId();
        existeVeterinario.tokenExpiracion = new Date(Date.now() + 3600000)
        await existeVeterinario.save();

        // Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,

        })

        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }
};

// Función para comprobar si un token es válido
const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({ token: token });

    if (tokenValido) {
        res.json({ msg: 'Token valido y el usuario existe' });
    } else {
        const error = new Error('Token no valido');
        return res.status(400).json({ msg: error.message });
    }
};

// Función para establecer un nuevo password
const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: 'Password modificado correctamente' });
    } catch (error) {
        console.log(error);
    }
};

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email })
        if (existeEmail) {
            const error = new Error("Este email ya esta en uso")
            return res.status(400).json({ msg: error.message })
        }
    }

    try {
        if (req.body.nombre !== undefined && req.body.nombre.trim() !== "") {
            veterinario.nombre = req.body.nombre;
        }
        if (req.body.email !== undefined && req.body.email.trim() !== "") {
            veterinario.email = req.body.email;
        }
        if (req.body.web !== undefined) {
            veterinario.web = req.body.web; // Permite guardar cadenas vacías
        }
        if (req.body.telefono !== undefined) {
            veterinario.telefono = req.body.telefono;
        }

        const veterinarioActualizado = await veterinario.save();

        res.json({ msg: "Perfil actualizado correctamente", veterinario: veterinarioActualizado });
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    // Leer Datos
    const { id } = req.veterinario
    const { pwd_actual, pwd_nuevo } = req.body

    // Comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    // Comprobar el password
    if (await veterinario.comprobarPassword(pwd_actual)) {
        // Almacenar el nuevo password
        veterinario.password = pwd_nuevo
        await veterinario.save()
        res.json({ msg: 'Password Actualizado Correctamente' })
    } else {
        const error = new Error('El Password Actual es Incorrecto');
        return res.status(400).json({ msg: error.message });
    }

}

// Exportar las funciones para usarlas en otros archivos
export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
};
