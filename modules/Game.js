const ID = require('./id');
const MAIN = require('../app');
const {Player} = require('./Player');

class Game{
    constructor(room){
        this.id = ID.get('game',4);
        this.members = room.members;
        this.MAIN = room.MAIN;

        let searcher = false;
        const roles = this.members.map(()=>0);
        while(!searcher){
            for(let i = 0; i < this.members.length; i++){
                if(!searcher){
                    const role = Math.random();
                    if(role > 0.8){
                        searcher = true;
                        roles[i] = 1;
                        break;
                    }
                };
            };
        };

        this.players = {}
        this.members.forEach((member, i) =>{
            const player = new Player(member, 
                {
                    role:roles[i],
                });
            this.players[member.login] = player;
        });
    };

    send(msg,data){
        this.members.forEach( user =>{
            if(this.MAIN.users[user.login]){
                user.socket.emit(msg,data);
            };
        });
    };

    sendStart(){
        this.send('GAME_start', {
            id:this.id,
            seed: Math.random(),
            players:Object.keys(this.players).map((player)=>{
                player = this.players[player];
                return {
                    login:player.login,
                    role:player.role,
                };
            })
        });
        this.loop();
    };

    loop(){
        const data = {};
        Object.keys(this.players).forEach(player =>{
            player = this.players[player];
            data[player.login] = {}
            data[player.login].position = player.position;
        });
        this.send('GAME_applyPositions',data);
        setTimeout(()=>{
            this.loop();
        },1000/60)
    };
};

module.exports.Game = Game;