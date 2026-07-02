import { io } from 'socket.io-client'

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ZTFlNTc4YS03NjUwLTQzYWUtYmI1Yy1iMTI3NGJjOWZmMDkiLCJpYXQiOjE3ODMwMTE0MDcsImV4cCI6MTc4MzAxNTAwN30.3gW5WLh7K00yhU1Z2DRdJKI2YSP-zUpVAkRDwQwB60c';

const BOARD_ID = '5b82fbc1-a1c9-4a22-94a1-7cb063c7fe0';

const socket = io('http://localhost:5000', {
    auth: {token: TOKEN,},reconnection: false,
});
socket.on('connect', () =>{
    console.log('Connected socket ID:', socket.id)

    //join a board room
    socket.emit('board:join', {BOARD_ID});
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