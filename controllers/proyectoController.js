const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

exports.crearProyecto = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores : errores.array()});
    }

    try{
        const proyecto = new Proyecto(req.body);

        //Guardar el creado via JWT
        proyecto.creador = req.usuario.id

        //Guardamos el proyecto
        proyecto.save();
        res.json(proyecto);
    }catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador : req.usuario.id });
        res.json({ proyectos });
    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualiza un proyecto
exports.actualizaProyecto = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores : errores.array()});
    }
    
    //extraer la info del proyecto
    const { nombre } = req.body;

    const nuevoProyecto = {}

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try { 
        //Revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        //Si el proyecto existe o no
        if(!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }        

        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario No Autorizado' });
        }

        //actualizar  
        proyecto = await Proyecto.findByIdAndUpdate({ _id : req.params.id}, {
            $set : nuevoProyecto } , { new : true } );     
           
        res.json({ proyecto });    
        
    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Elimina un proyecto por su id
exports.eliminarProyecto = async (req, res) => {
    try { 

        //Revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        //Si el proyecto existe o no
        if(!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }        

        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario No Autorizado' });
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id : req.params.id});

        res.json({ msg: 'Proyecto Eliminado'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }

    
}