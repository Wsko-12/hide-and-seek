const ID = require('./id');
const MAIN = require('../app');
const {Player} = require('./Player');

class Game{
    constructor(room){
        this.id = ID.get('game',4);
        this.members = room.members;
        this.MAIN = room.MAIN;


        const teamMates = Math.floor(this.members.length/2);
        let firstTeamMates = 0;
        const teams = this.members.map(()=>0);
        while(firstTeamMates < teamMates){
            for(let i = 0; i < this.members.length; i++){
                const teamValue = Math.random();
                if(teamValue > 0.5){
                    if(firstTeamMates < teamMates){
                        if(teams[i] != 1){
                            teams[i] = 1;
                            firstTeamMates++;
                        };
                    };
                };
            };
        };
        this.checkPoints = [-1,-1,-1];
        this.players = {}
        this.members.forEach((member, i) =>{
            const player = new Player(member, 
                {
                    team:teams[i],
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
                    team:player.team,
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