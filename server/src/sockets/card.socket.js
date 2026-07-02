export default function cardSocket(io, socket) {
    //Typing indicator 
    socket.on('card:typing', ({ boardId, cardId}) =>{
        socket.to(boardId).emit('card:typing', {
            cardId,
            user: socket.user
        });
    });

    socket.on('card:typing_stop', ({ boardId, cardId}) =>{
        socket.to(boardId).emit('card:typing_stop', {
            cardId, 
            user: socket.user
        });
    });  
};