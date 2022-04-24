import * as Geom from "../geometry.js";
import {MAIN} from "../main.js";

class CheckPoint extends Geom.Circle{
    constructor(i){
        let x,y;
        const size = MAIN.game.mapSize/32;
        const shift = size*6; 
        
        if(i === 0){
            x = 0+shift;
            y = MAIN.game.mapSize-shift;
        }
        if(i === 1){
            x = MAIN.game.mapSize/2;
            y = MAIN.game.mapSize/2;
        }
        if(i === 2){
            x = MAIN.game.mapSize-shift;
            y = 0+shift;
        }
        super(x,y,size);
        this.timeStamp = null;
        this.team = -1;
        this.index = i;

    }

    draw(ctx){
        if(this.team != MAIN.player.state.team){
            ctx.fillStyle = 'red';
        }else{
            ctx.fillStyle = 'blue';
        }
        if(this.team === -1){
            ctx.fillStyle = 'white';
        }

        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        this.checkDistance();
    }

    checkDistance(){
        if(this.team === MAIN.player.state.team)return;
        const dist = MAIN.player.point.getDistanceTo(this.center);
        if(dist < this.r){
            let enemyOnPoint = 0;
            let unitsOmPoint = 0;

            for(let i=0;i<MAIN.game.players.length;i++){
                const player = MAIN.game.players[i];
                const dist =this.center.getDistanceTo(player.point);
                if(dist < this.r){
                    if(player.state.team === MAIN.player.state.team){
                        unitsOmPoint++;
                    }else{
                        enemyOnPoint++;
                    }
                };
            };
            if(unitsOmPoint > enemyOnPoint){
                if(this.timeStamp === null){
                    this.timeStamp = Date.now();
                }else{
                    if(Date.now() - this.timeStamp > MAIN.game.catchTime){
                        this.timeStamp = null;
                        this.team = this.team === -1 ? MAIN.player.state.team : -1;
                        this.sendState();
                    };
                };
            }else if(unitsOmPoint === enemyOnPoint && this.team != -1 && this.team != MAIN.player.state.team){
                if(this.timeStamp === null){
                    this.timeStamp = Date.now();
                }else{
                    if(Date.now() - this.timeStamp > MAIN.game.catchTime){
                        this.timeStamp = null;
                        this.team = -1;
                        this.sendState();
                    };
                };
            }else{
                this.timeStamp = null;

            }   
        }else{
            this.timeStamp = null;
        };
    };


    sendState(){
        MAIN.socket.emit('POINT_state',{
            gameID: MAIN.game.id,
            index: this.index,
            team:this.team,
        });
    };

    applyState(data){
        this.timeStamp = null;
        this.team = data.team;
    };
}

export {CheckPoint}