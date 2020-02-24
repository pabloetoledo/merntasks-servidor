const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

///api/proyectos
router.post('/',
    auth,
    [
      check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
)

//Obtener todos los proyectos
router.get('/',
    auth,    
    proyectoController.obtenerProyectos
)

//Modificar un proyecto
router.put('/:id',
    auth,  
    [
      check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],  
    proyectoController.actualizaProyecto
)

//Eliminar un proyecto
router.delete('/:id',
    auth,  
    proyectoController.eliminarProyecto
)

module.exports = router;