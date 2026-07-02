export default function boardSocket(io, socket) {
    socket.on('board-join',  ({ boardId }) => {
        socket.join(boardId);
        socket.to(boardId).emit('presence:joined', { user: socket.user});
        socket.currentBoardId = boardId;
    });

    socket.on('board: leave', ({ boardId }) =>{
        socket.leave(boardId);
        socket.to(boardId).emit('presence: left', {user: socket.user});
        socket.currentBoardId = null;
    });

    socket.on('disconnect', () =>{
        if(socket.currentBoardId){
            socket.io(socket.currentBoardId).emit('presence:left', {user: socket.user});
        }
    });
};
