import {MAIN} from "./main.js";
import * as Geom from "./geometry.js";


class Player{
    constructor(data){
        this.login = data.login;
        this.role = data.role;
        this.point = new Geom.Point(0,0);
        this.speed = data.role ? 1.2 : 1;
        if(data.login === MAIN.user.login){
            this.moveFlags = {
                up:false,
                right:false,
                down:false,
                left:false,
            }
            MAIN.player = this;
            this.initListeners();
        };

    };
    draw(ctx){
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    };

    initListeners(){
        document.addEventListener('keydown', (e)=>{
            if(e.code === 'ArrowRight') this.moveFlags.right = true;
            if(e.code === 'ArrowLeft') this.moveFlags.left = true;
            if(e.code === 'ArrowUp') this.moveFlags.up = true;
            if(e.code === 'ArrowDown') this.moveFlags.down = true;
        });
        document.addEventListener('keyup', (e)=>{
            if(e.code === 'ArrowRight') this.moveFlags.right = false;
            if(e.code === 'ArrowLeft') this.moveFlags.left = false;
            if(e.code === 'ArrowUp') this.moveFlags.up = false;
            if(e.code === 'ArrowDown') this.moveFlags.down = false;
        });
    };

    move(){
        const shift = new Geom.Point(0,0)
        if(this.moveFlags.right) shift.x += 1;
        if(this.moveFlags.left) shift.x -= 1;
        if(this.moveFlags.up) shift.y -= 1;
        if(this.moveFlags.down)  shift.y += 1;

        const point = new Geom.Point(this.point.x + shift.x,this.point.y + shift.y);


        if(shift.x || shift.y){
            const vector = new Geom.Vector(this.point,point).normalizeThis();
            this.point.x += vector.x * this.speed;
            this.point.y += vector.y * this.speed;
        };


        MAIN.socket.emit('GAME_position',{
            gameID:MAIN.game.id,
            player:MAIN.player.login,
            position:{x:this.point.x,y:this.point.y}
        });


    };

};

export {Player};