const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;

http.listen(PORT, '0.0.0.0', () => {
    console.log('Сервер запущен');
  });


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/', express.static(__dirname + '/client'));

const io = require('socket.io')(http);

const { Room } = require('./modules/Room');
const { User } = require('./modules/User');
const { Game } = require('./modules/Game');



const MAIN = {
    rooms:{},
    sockets:{},
    users:{},
    games:{},

    createGame(room){
        delete this.rooms[room.id];
        const game = new Game(room);
        setTimeout(()=>{
            game.send('GAME_over',0);
        },60000*3);
        this.games[game.id] = game;
        game.sendStart();
    }
};
io.on('connection', (socket)=>{
    MAIN.sockets[socket.id] = socket;
    console.log('connected');

    socket.on('LOGIN_login',(data)=>{
        const user = new User({
            login:data.login,
            socket,
        })
        MAIN.sockets[socket.id].user = user;
        MAIN.users[user.login] = user;
        const rooms = Object.keys(MAIN.rooms);
        if(!rooms.length){
            const room = new Room(MAIN);
            MAIN.rooms[room.id] = room;
            room.add(user);
        }else{
            MAIN.rooms[rooms[0]].add(user); 
        };
    });


    socket.on('disconnect', ()=>{
        const userSocket = MAIN.sockets[socket.id];
        if(userSocket.user){
            delete MAIN.users[userSocket.user.login];
        }
        delete MAIN.sockets[socket.id];
    });

    socket.on('GAME_position',(data)=>{
        const game = MAIN.games[data.gameID];
        if(game){
            const player = game.players[data.player];
            if(player){
                player.position = data.position;
            };
        }
    });


    socket.on('ENEMY_find',(data)=>{
        const game = MAIN.games[data.gameID];
        if(game){
            const enemy = game.players[data.enemy];
            if(enemy){
                enemy.emit('ENEMY_detect',{
                    enemy:data.player,
                    timeStamp: data.timeStamp,
                });
            };
        }
    });

    socket.on('ENEMY_catch',(data)=>{
        const game = MAIN.games[data.gameID];
        if(game){
            const enemy = game.players[data.enemy];
            if(enemy){
                game.send('ENEMY_catched',{
                    player:data.enemy,
                    team:data.team,
                });
            };
        };
    });

    socket.on('GAME_over', (gameID)=>{
        const game = MAIN.games[gameID];
        if(game){
            game.send('GAME_over',1);
        };
    })
});
