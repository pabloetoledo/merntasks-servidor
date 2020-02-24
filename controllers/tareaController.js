const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

exports.crearTarea = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores : errores.array()});
    }

    try { 
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({ msg: 'Proyeco no encontrado' });
        }

        //verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario No Autorizado' });
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json(tarea);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) =>{
    try { 
        //Extraer el proyecto y comprobar si existe
        //const { proyecto } = req.body;
        const { proyecto } = req.query; //Cuando del front-end para como params, debo usar .query

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({ msg: 'Proyeco no encontrado' });
        }

        //verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario No Autorizado' });
        }

        //Obtenemos las tareas por proyecto
        const tareas = await Tarea.find( { proyecto } ); //Obtener las tareas donde el proyecto sea igual al proyecto que pasamos
        res.json({ tareas });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}


//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;        

        //Verificamos si la tarea existe o no
        //la definimos como let para que abajo volvamos a asignar un valor a estar variable
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({ msg: 'No existe tarea' });
        }

        //obtenemos el proyecto al que pertenece la tarea
        const existeProyecto = await Proyecto.findById(proyecto);

        //verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario No Autorizado' });
        }       

        //Crear un objeto con la nueva informacion
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;                
        nuevaTarea.estado = estado;        

        //ahora modificamos la tarea
        tarea = await Tarea.findOneAndUpdate({ _id : req.params.id}, nuevaTarea, { new : true });

        console.log(tarea);
        res.json({ tarea });        
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');    
    }
}

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        //const { proyecto } = req.body;
        const { proyecto } = req.query; //Cuando del front-end para como params, debo usar .query

        //Verificamos si la tarea existe o no
        //la definimos como let para que abajo volvamos a asignar un valor a estar variable
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({ msg: 'No existe tarea' });
        }

        //obtenemos el proyecto al que pertenece la tarea
        const existeProyecto = await Proyecto.findById(proyecto);

        //verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'Usuario No Autorizado' });
        }       

        //Eliminar
        await Tarea.findOneAndRemove({ _id : req.params.id});
        res.json({ msg: 'Tarea Eliminada' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');    
    }
}