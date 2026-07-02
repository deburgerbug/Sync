import http from 'http'
import app from './app.js'
import { Server } from 'socket.io'
import { initSocket} from './src/sockets/index.js'

const port = process.env.PORT || 5000;
const server =  http.createServer(app)

const io = new Server (server, {
    cors:{
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.set('io',io)
initSocket(io)

server.listen(port, ()=>{
    console.log(`Server running on Port ${port}`);
});


