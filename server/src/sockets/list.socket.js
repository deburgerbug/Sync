export default function listSocket(io, socket) {
    socket.on('card:drag_start', ({ boardId, cardId})=>{
        socket.to(boardId).emit('card:drag_start', {
            cardId,
            user: socket.user
        });
    });

    socket.on('card:drag_stop', ({boardId, cardId}) =>{
        socket.to(boardId).emit('card:drag_stop', {
            cardId,
            user: socket.user
        });
    });
};
