const ID = require('./id');
const MAIN = require('../app');
const {Player} = require('./Player');

class Game{
    constructor(room){
        this.id = ID.get('game',4);
        this.members = room.members;
        this.MAIN = room.MAIN;
        this.size = 1024;
        this.buffs = {};

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
        console.log(teams);
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

    createBuff(){
        let buffName;
        Object.keys(this.buffs).forEach((buffID)=>{
            this.send('BUFF_kill',buffID);
        })

        const random = Math.random();

        buffName = Math.random() > 0.5 ? 'Low' : 'Noise';
        if(random < 0.05){
            buffName = 'Hulk';
        }
        if(random >= 0.05 &&random < 0.1){
            buffName = 'Invisible';
        }
        if(random >= 0.1 && random < 0.2){
            buffName = 'Speed';
        }
        if(random >= 0.2 && random < 0.25){
            buffName = 'Attention';
        }
        if(random >=0.25 && random < 0.35){
            buffName = 'Xray';
        }

        const id = ID.get('buff',4);
        const data = {
            id:id,
            x:Math.random()*this.size,
            y:Math.random()*this.size,
            name:buffName,
        };
        this.buffs[id] = data;


        this.send('BUFF_create',data)

        setTimeout(()=>{
            this.createBuff();
        },10000)
    }

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
            size:this.size,
            players:Object.keys(this.players).map((player)=>{
                player = this.players[player];
                return {
                    login:player.login,
                    team:player.team,
                };
            })
        });
        setTimeout(()=>{
            this.createBuff();
        },5000)
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