import {MAIN} from "./main.js";
import * as Geom from "./geometry.js";
import {ViewCircle} from "./player/ViewCircle.js";


class Player{
    constructor(data){
        this.login = data.login;
        this.role = data.role;
        this.point = new Geom.Point(0,0);
        this.speed = data.role ? 1.2 : 1;
        this.angle = new Geom.Angle(45);
        this.visible = false;
        if(data.login === MAIN.user.login){
            const viewRadius = data.role ?  MAIN.game.mapSize/6 : MAIN.game.mapSize/6;
            this.viewCircle = new ViewCircle(this,viewRadius);
            this.moveFlags = {
                up:false,
                right:false,
                down:false,
                left:false,
            }
            MAIN.player = this;
            this.player = true;
            this.initListeners();
        };

    };
    draw(ctx){


        if(this.player){
            this.viewCircle.draw(ctx);
            this.viewCircle.findClosestCollidersPoints(MAIN.game.colliders);

        };

        if(this.player){
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }

        if(this.visible){
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        };

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
            const oldPoint = new Geom.Point(this.point.x, this.point.y);

            const newPoint = new Geom.Point(this.point.x + vector.x * this.speed*10, this.point.y + vector.y * this.speed*10);
            // this.point.x += vector.x * this.speed;
            // this.point.y += vector.y * this.speed;

            const ray = new Geom.Ray(oldPoint,newPoint);

            let closest = null;
            let closestDist = Infinity;
            
            this.viewCircle.closest.forEach((collider)=>{
                const intersect = ray.checkIntersection(collider);
                if(intersect){
                    const dist = oldPoint.getDistanceTo(intersect);
                    if(dist < closestDist){
                        closestDist = dist;
                        closest = intersect;
                    };
                };
            });
            this.angle = oldPoint.anglePoint(newPoint);
            if(ray.length - closestDist < 4){
                this.point.x += vector.x * this.speed;
                this.point.y += vector.y * this.speed;
            }   
        };


        MAIN.socket.emit('GAME_position',{
            gameID:MAIN.game.id,
            player:MAIN.player.login,
            position:{x:this.point.x,y:this.point.y}
        });


    };

};

export {Player};