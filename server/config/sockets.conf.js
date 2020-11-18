

module.exports.listen = (server) => {
    const socketio = require('socket.io');
    io = socketio(server);
    io.on('connect',(socket) => {
        socket.on('disconnect', (displayName) => {
            socket.displayName = displayName;
        })
    socket.on('joinGame', (gameId) => {
        socket.gameRoom = gameId;
        socket.join(gameId, ()=>{});
    })
    socket.on('leaveGame', () => {
        socket.to('host' + socket.gameRoom).emit('leaveGame', socket.displayName, socket.gameRoom);
        socket.gameRoom = null;
        socket.rooms = {};
    })
    socket.on('newMessage', (data) => {
        io.to(socket.gameRoom).emit('newMessage', data);
    })
    socket.on('roomClosed', ()=>{
        io.to(socket.gameRoom).emit('roomClosed', null);
    })
})
    return io;
}
