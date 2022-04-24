import { Game } from "../game.js";
import * as Geom from "../geometry.js";
import {MAIN} from "../main.js";

class SaveZone extends Geom.Circle{
    constructor(){
        const center = MAIN.player.state.team ? new Geom.Point(0,0) : new Geom.Point(MAIN.game.mapSize,MAIN.game.mapSize);
        const r = MAIN.game.mapSize/6;
        super(center,r);
    };

    checkDistance(){
        const dist = MAIN.player.point.getDistanceTo(this.center);
        Object.keys(MAIN.player.state.detected).forEach(login => {
            const player = MAIN.game.playersObj[login];
            player.state.inFind = false;
            if(Date.now() - MAIN.player.state.detected[login] < MAIN.game.catchTime){
                player.state.inFind = true;
                if(dist < this.r){  
                    
                    MAIN.socket.emit('ENEMY_catch',{
                        gameID:MAIN.game.id,
                        enemy:login,
                        team:MAIN.player.state.team,
                    });
                    delete MAIN.player.state.detected[login];

                    MAIN.game.playersObj[login].state.team = MAIN.player.state.team;

                    let allFinded = true;
                    for(let i = 0; i< MAIN.game.players.length; i++){
                        if(MAIN.game.players[i].state.team != MAIN.player.team){
                            allFinded = false;
                        };
                    };
                    if(allFinded){
                        MAIN.socket.emit('GAME_over', {
                            gameID:MAIN.game.id,
                            team:MAIN.player.team,
                        });
                    };
                };
            }else{
                delete MAIN.player.state.detected[login];
            };


        });

    };
    draw(ctx){
        this.checkDistance();
        ctx.fillStyle = 'rgba(0, 255, 170,0.5)';
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
    };
}

export {SaveZone}