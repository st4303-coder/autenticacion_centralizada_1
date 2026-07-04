const Usuarios = require("../models/usuario");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

exports.registerUsuario = async (req,res) => {
    try {
        const{email,password} =req.body;
        const usuario = await Usuarios.findOne({email});
         if(usuario){
        return res.status(401).json({msg:'El usuario ya existe'})
        } 
        const salt = await bcrypt.genSalt(10); 
        const newPassword = await bcrypt.hash(password,salt);
        const nuevoUsuario = new Usuarios({
            email,
            password: newPassword
        });
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    }catch (error) {
       res.status(500).json({error: "Error: Crea un usuario", message: error}); 
    }
    
}

exports.loginUsuario = async (req,res) => {
    try {
        const {email,password} = req.body;
        const usuario = await Usuarios.findOne({email});
        if(!usuario){
        return res.status(401).json({msg:'El usuario no existe. Credencial invalida'})
        } 
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) return res.status(400).json({msg:'La contraseña no es correcta.Credencial invalida'});

        const payload = {
            usuario:{
            id: usuario.id,
            email: usuario.email
            }
        };
        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' },
            (err,token) =>{ 
            if(err) throw err;
            res.json({token});
        });

    } catch (error) {
        res.status(500).json({error: "Error en el servidor", message: error}); 
    }
}

exports.getUsuario = async (req, res) => {
    try {
        const usuario = await Usuarios.findById(req.usuario.id).select("-password"); 
        
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario", message: error.message });
    }
}

exports.updateUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        const camposAActualizar = {};

        if (email) {
            const existeEmail = await Usuarios.findOne({ email });
            if (existeEmail && existeEmail.id !== req.userId) {
                return res.status(400).json({ msg: "El email ya está en uso por otro usuario" });
            }
            camposAActualizar.email = email;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            camposAActualizar.password = await bcrypt.hash(password, salt);
        }

        const usuarioActualizado = await Usuarios.findByIdAndUpdate(
            req.userId,
            { $set: camposAActualizar },
            { new: true } 
        ).select("-password");

        res.json({ msg: "Usuario actualizado con éxito", usuario: usuarioActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el usuario", message: error.message });
    }
}

exports.deleteUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuarios.findByIdAndDelete(req.userId);

        if (!usuarioEliminado) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.json({ msg: "Cuenta eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el usuario", message: error.message });
    }
}


