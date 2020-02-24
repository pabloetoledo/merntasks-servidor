//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const authControllers = require('../controllers/authController');
const auth = require('../middleware/auth');

// /api/usuarios
router.post('/',
    authControllers.autenticarUsuario    
);

// Obtiene el usuario autenticado
router.get('/', 
    auth,
    authControllers.usuarioAutenticado    
);

module.exports = router;