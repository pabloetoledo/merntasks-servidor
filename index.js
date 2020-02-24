const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//crea el servidor
const app = express();

//conectar a la base de datos
conectarDB();

//habilitar cors
app.use(cors());

//Habilitar express.json
app.use( express.json({ extended: true}));


//puerto de la app
const port = process.env.port || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));



//definimos una pagina principal para probar el servidor
/*app.get('/', (red, res) => {
    res.send('Hola Mundo');
});*/

app.listen(port, '0.0.0.0', () =>{
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});