const path = require('path');
const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
//  res.end();
})

let userlist = [];
//listen on the connection event for incoming socket
//execute this when someone connect

io.on('connection', function(socket){

  socket.on('useradd',  name =>{
    //store name in socket session
    socket.username = name;
    userlist.push(name);

    //emit to chat message instead
    socket.broadcast.emit('chat message', {
      name: socket.username,
      input:' connected'
    });

    io.emit('userlist', userlist);

    //  input: 'connected'
    //});
  });

  //io.emit('chat message', "Someone connected");
  socket.on('chat message', (msg)=>{
    //send message to everyone including the sender
    //io.emit('chat message', data );
    socket.broadcast.emit('chat message', {
      name: socket.username,
      input: msg
    });
  });

  socket.on('typing', ()=>{
    //let str = user + ' is typing...';
    socket.broadcast.emit('typing', socket.username+' is typing...');
  })

  //send a message to everyone EXCEPT for certain emitting Socket
  //socket.broadcast.emit('hi');

  //when someone disconnects
  socket.on('disconnect', ()=>{
    //console.log('Someone disconnected');
    userlist = userlist.filter(el=>{
      return el !== socket.username
    });
    
    //update the userlist
    io.emit('userlist', userlist);

    socket.broadcast.emit('chat message', {
      name: socket.username,
      input: 'disconnected'
    });
  });
});




//starting from 3.0 express app become request handler functions
//tha tyou pass to http or http Server instances. You need to pass the Server to
//to socket.io and not the express application
http.listen(3000, ()=>{
  console.log('server 3000');
})
