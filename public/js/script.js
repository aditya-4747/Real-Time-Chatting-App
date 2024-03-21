const socket = io();

const form = document.getElementById('form');
const inputMessage = document.getElementById('message');
const messages = document.getElementById('messages-section');

const newChat = (message, position) => {
    const newMessage = document.createElement('div');
    newMessage.innerText = message;
    newMessage.classList.add('chat');
    newMessage.classList.add(position);
    messages.append(newMessage);
}

const newJoin = (message) => {
    const newMessage = document.createElement('div');
    newMessage.innerText = message;
    newMessage.classList.add('joined');
    newMessage.classList.add('center');
    messages.append(newMessage);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = inputMessage.value;
    socket.emit('send', text);
    newChat(`You : ${text}`, 'right');
    form.reset();
});

const username = prompt("Enter your name to join :");
socket.emit('new-user-joined', username);

socket.on('user-joined', (name) => {
    newJoin(`${name} joined the chat`);
});

socket.on('recieve', data => {
    newChat(`${data.name} : ${data.message}`, 'left');
});

socket.on('disconnected', name => {
    newJoin(`${name} left the chat`);
});