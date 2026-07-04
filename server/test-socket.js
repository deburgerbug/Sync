import { io } from 'socket.io-client'

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZDBiMTJmNi1jMTBhLTQ5NmUtODY3MS04MmM4YWY2N2Q2MjkiLCJpYXQiOjE3ODMxNzk3OTEsImV4cCI6MTc4MzE4MzM5MX0.yGIENE0f33RSEBnFmoD0CWvTEsu55KG0zFphmj_fNEI'

const BOARD_ID = 'e2991ecb-941f-49a1-b3e5-c25661991619';

const socket = io('http://localhost:5000', {
    auth: {token: TOKEN,},reconnection: false,
});
socket.on('connect', () =>{
    console.log('Connected socket ID:', socket.id)

    //join a board room
    socket.emit('board:join', {boardId :BOARD_ID});
    console.log('JOining board room:', BOARD_ID)
});

socket.on('presence:joined', (data) =>{
    console.log('Presence Joined', data)
});

socket.on('presence:left', (data) =>{
    console.log('presence left:', data)
});

socket.on('card:created', (data) =>{
    console.log('card created broadcast received:', data)
})

socket.on('list:created', (data) => {
  console.log('📋 List created broadcast received:', data);
});

socket.on('connect_error', (err) => {
  console.error(' Connection error:', err.message);
});

socket.on('disconnect', (reason) => {
  console.log(' Disconnected:', reason);
});