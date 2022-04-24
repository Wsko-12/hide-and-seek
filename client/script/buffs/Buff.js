import * as Geom from "../geometry.js";
import {MAIN} from "../main.js";


class Buff extends Geom.Circle{
    constructor(data){
        super(data.x,data.y,20);
        this.id = data.id;
        this.name = data.name;
        this.title = data.name.charAt(0);
        this.applyed = false;
        this.removed = false;
    };
    draw(ctx){
        if(!this.applyed){
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.r, 0, 2 * Math.PI);
            ctx.fill();
    
            ctx.fillStyle = 'black';
    
            ctx.font = "bolder 32px sans-serif";
            ctx.fillText(this.title, this.center.x - 12, this.center.y+12);
            
            if(MAIN.player.buff === null){
                this.checkPlayer();
            };
        }else{
            this.remove();
        };

    };

    checkPlayer(){
        
        const dist = MAIN.player.point.getDistanceTo(this.center);
        if(dist < this.r){
            MAIN.socket.emit('BUFF_apply',{
                gameID:MAIN.game.id,
                player:MAIN.player.login,
                buff:this.id,
            });
        };
    };

    apply(player){
        this.applyed = true;
        this.timeStamp = Date.now();
        this.player = MAIN.game.playersObj[player];
        this.player.buff = this.name;


        if(this.name === 'Speed'){
            this.player.speed *= 1.5;
        };
        if(this.name === 'Invisible'){
            this.player.buff = this.name;
        };
        if(this.name === 'Low'){
            this.player.speed /= 1.5;
        };
        
    };

    remove(){
        if(!this.removed){
            if(Date.now() - this.timeStamp > MAIN.game.buffsTime){
                this.removed = true;
                this.player.buff = null;
                if(this.name === 'Speed'){
                    this.player.speed /= 1.5;
                };
                if(this.name === 'Invisible'){
                    
                };
                if(this.name === 'Low'){
                    this.player.speed *= 1.5;
                };


                delete MAIN.game.buffs[this.id];
            };
        };

    };


}
export {Buff};