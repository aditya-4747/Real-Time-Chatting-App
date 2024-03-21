import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const port = 3000;

const io = new Server(server);

const users = {};

app.use(express.static("public"));

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket)=> {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('recieve', { message : message , name : users[socket.id] });
    });

    socket.on('disconnect', ()=> {
        socket.broadcast.emit('disconnected', users[socket.id]);
        delete users[socket.id];
    });

});

server.listen(port, () => {
    console.log(`Server started successfully on port ${port}`);
});