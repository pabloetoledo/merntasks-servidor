const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require ('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores : errores.array()});
    }

    const {email, password} = req.body;

    try{
        //Revisar que el email sea unico
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).send({msg: 'El usuario ya existe'});
        }

        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();

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
        res.status(400).send('Hubo un error');
    }
}