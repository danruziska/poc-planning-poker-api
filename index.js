var http = require('http');
var io = require('socket.io');
var port = process.env.PORT || 5000;

var server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end('Websocket server is up and running!\n');    
});

server.listen(port, function(){
    console.log('server up at port ' + process.env.PORT || 5000);
});

var realtimeListener = io.listen(server);

realtimeListener.on('connection',function(socket){
    socket.on('room', function(roomId){
        console.log('evento room recebido pelo cliente');
        socket.join(roomId);
    });

    socket.on('disconnect', function(){
        if(socket){
            realtimeListener.emit('socket-disconnected',socket.id);
            console.log('disconnected:' + socket.id);
        }        
    });

    socket.on('join-room', function(userData, roomId){
        if(socket){
            console.log('emitindo evento user-joined para a sala: ' + roomId);
            realtimeListener.in(roomId).emit('user-joined', userData, socket.id);
        }
    });

    socket.on('send-card', function(user,roomId,cardValue){
        if(socket){
            console.log('server: ' + user.id);
            realtimeListener.in(roomId).emit('card-sent', user,cardValue);
        }
    });

    socket.on('reset-card', function(roomId){
        if(socket){
            realtimeListener.in(roomId).emit('reset-card');
        }
    });
});