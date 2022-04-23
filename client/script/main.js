import { ID } from './id.js';
import { Game } from './game.js';


const MAIN = {
    socket: io(),
};

document.querySelector('#joinBtn').addEventListener('click',()=>{
    const login = document.querySelector('#loginInpt').value || ID.get('player',4);
    document.querySelector('#loginForm').remove();
    MAIN.user = {login};
    MAIN.socket.emit('LOGIN_login',{
        login,
    });
});

MAIN.socket.on('ROOM_data',(data)=>{
    let roomEl = document.querySelector('#roomCard');
    if(!roomEl){
        roomEl = document.createElement('div');
        roomEl.id = 'roomCard';
        roomEl.classList.add('room_card');

        const title = document.createElement('h2');
        title.classList.add('room_title');
        title.innerHTML = data.id;

        const count = document.createElement('h3');
        count.id = 'roomCount';
        count.classList.add('room_count');
        count.innerHTML = `Waiting: ${data.maxMembers - data.members.length}`;

        const members = document.createElement('ul');
        members.id = 'roomList';
        members.classList.add('room_list');
        
        data.members.forEach(member => {
            const listItem = document.createElement('li');
            listItem.classList.add('room_list-item');
            listItem.innerHTML = member;
            members.append(listItem);
        });

        roomEl.append(title,count,members);

        
        document.body.append(roomEl);
    }else{
        const count = document.querySelector('#roomCount');
        count.innerHTML = `Waiting: ${data.maxMembers - data.members.length}`;

        const members = document.querySelector('#roomList');
        members.innerHTML = '';

        data.members.forEach(member => {
            const listItem = document.createElement('li');
            listItem.classList.add('room_list-item');
            listItem.innerHTML = member;
            members.append(listItem);
        });

    }
});


MAIN.socket.on('GAME_start',(seed)=>{
    document.querySelector('#roomCard').remove()
    MAIN.game = new Game(seed);
});

MAIN.socket.on('GAME_newPositions',(data)=>{
    MAIN.game.players.forEach(player =>{
        player.point.x = data[player.login].position.x;
        player.point.y = data[player.login].position.y;
    });
});
export {MAIN};