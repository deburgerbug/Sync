export default function boardSocket(io, socket) {
    socket.on('board:join',  ({ boardId }) => {
        console.log(`✅ board:join event RECEIVED — boardId: ${boardId}, user: ${socket.user.name}, socketId: ${socket.id}`);
        socket.join(boardId);
        console.log(`✅ Socket ${socket.id} successfully joined room: ${boardId}`);
        console.log(`✅ Socket rooms:`, socket.rooms);
        socket.to(boardId).emit('presence:joined', { user: socket.user});
        socket.currentBoardId = boardId;
    });

    socket.on('board:leave', ({ boardId }) =>{
        socket.leave(boardId);
        socket.to(boardId).emit('presence:left', {user: socket.user});
        socket.currentBoardId = null;
    });

    socket.on('disconnect', () =>{
        if(socket.currentBoardId){
            socket.to(socket.currentBoardId).emit('presence:left', {user: socket.user});
        }
    });
};
