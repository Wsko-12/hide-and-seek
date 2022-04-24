import { Game } from "../game.js";
import * as Geom from "../geometry.js";
import {MAIN} from "../main.js";

class SaveZone extends Geom.Circle{
    constructor(){
        const center = MAIN.player.role ? new Geom.Point(0,0) : new Geom.Point(MAIN.game.mapSize,MAIN.game.mapSize);
        const r = MAIN.game.mapSize/6;
        super(center,r);
    };

    checkDistance(){
        const dist = MAIN.player.point.getDistanceTo(this.center);
        if(MAIN.player.role === 1){
            Object.keys(MAIN.player.state.find).forEach(login => {  
                const player = MAIN.game.playersObj[login];
                if(Date.now() - MAIN.player.state.find[login] < MAIN.game.time){
                    player.state.inFind = true;
                    if(dist < this.r){  
                        player.state.inFind = false;
                        MAIN.game.playersObj[login].state.role = 1;
    
                        MAIN.socket.emit('ENEMY_catch',{
                            gameID:MAIN.game.id,
                            enemy:login,
                        });
                        delete MAIN.player.state.find[login];
    
                        let allFinded = true;
                        for(let i = 0; i< MAIN.game.players.length; i++){
                            if(MAIN.game.players[i].state.role === 0){
                                allFinded = false
                            };
                        };
                        if(allFinded){
                            MAIN.socket.emit('GAME_over', MAIN.game.id);
                        };
                    };
                }else{
                    player.state.inFind = false;
                    MAIN.socket.emit('ENEMY_lost',{
                        gameID:MAIN.game.id,
                        player:MAIN.player.login,
                        enemy:login,
                    });
                    delete MAIN.player.state.find[login];
                };
            });
        }


        if(MAIN.player.role === 0){
            if(dist < this.r){ 
                Object.keys(MAIN.player.state.detected).forEach(login => {
                    MAIN.game.playersObj[login].state.inFind = false;
                    MAIN.socket.emit('ENEMY_catchLost', {
                        gameID:MAIN.game.id,
                        hunter:login,
                        player:MAIN.player.login,
                    });

                });
             }

        }

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