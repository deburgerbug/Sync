import { io } from 'socket.io-client'

const socket = io('http://localhost:5000', {
    auth:{
        token: localStorage.getItem('token')
    },
    authConnet: false,  //connect only when user is logged in 
});

export default socket
