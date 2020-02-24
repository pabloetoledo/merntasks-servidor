const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require ('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores : errores.array()});
    }

    //extraer el email y el password
    const {email, password} = req.body;

    try{
        //REvisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if(!usuario){
            return res.status(400).json({ msg : 'El usuario no existe' });
        }

        //Revisar su password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto) {
            return res.status(400).json({ msg : 'El password es incorrecto' });
        }

        //si todo es correcto
        //crear y firmar el jwt
        const payload = {
            usuario : {
                id : usuario.id
            }
        };

        //firmar el jwt
        //Como en react no hay sesiones se utilizan token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn : 3600 //El token vence o expira en una hora
        }, (error, token) => {
            if(error) throw error;            
            //mensaje de confirmacion
            res.json({token});
        });  

    }catch(error){
        console.log(error);
    }
}

//Obtiene que usuario esta autenticado 
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password'); //El -password significa que al password no lo queremos seleccionar
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' })
    }
}