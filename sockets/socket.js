const { io } = require('../index');
const { ComprobarJWT } = require('../helpers//jswt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


// Mensajes de Sockets
io.on('connection', client => {

    const [valido, uid] = ComprobarJWT(client.handshake.headers['x-token']);

    //* Verificar autenticación
    if (!valido) { return client.disconnect(); }

    //* Cliente autenticado
    usuarioConectado(uid);

    //* Ingresar al usuario a una sala en particular
    // Sala global - todos los dispositivos conectados
    // client.id - es para un cliente en especifico
    //*Creando sala unica
    /* Para crear una sala con un identificar unico
     (Este identificar es el id del usuario a quien se quiere enviar el mensaje)**/
     client.join(uid);

    //*  Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {
        //TODO: Guardar mensajes
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    });


    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });
});
