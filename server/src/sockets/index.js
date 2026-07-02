import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js'
import boardSocket from './board.socket.js'
import cardSocket from './card.socket.js'
import listSocket from './list.socket.js'

export const initSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error('Authentication error: no token'))
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userRepository.findUserById(decoded.userId)

            if (!user) {
                return next(new Error('Authentication error: User not found'))
            }

            //Attach user to socket
            socket.user = { id: user.id, name: user.name, email: user.email }
            next();

        } catch (err) {
            next(new Error('Authentication error: Invalid Token.'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id} | User: ${socket.user.name}`)
        //Register event handlers
        boardSocket(io, socket),
        cardSocket(io, socket),
        listSocket(io, socket);

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`)
        });
    });
}

