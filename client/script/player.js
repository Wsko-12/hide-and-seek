import {MAIN} from "./main.js";
import * as Geom from "./geometry.js";
import {ViewCircle} from "./player/ViewCircle.js";


class Player{
    constructor(data){
        this.login = data.login;
        this.role = data.role;
        this.finded = {};
        if(data.role){
            this.point = new Geom.Point(0,0);
        }else{
            this.point = new Geom.Point(MAIN.game.mapSize,MAIN.game.mapSize);
        }
        // this.speed = data.role ? 1.3 : 1;
        this.speed = 1.5;
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

        if(this.role === MAIN.player.role){
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        };
        if(this.visible || this.find){
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }

    };

    changeRole(role){
        this.role = 1;
        this.point.x = 0;
        this.point.y = 0;

        MAIN.game.players.forEach(player =>{
            player.find = false;
        });
        MAIN.game.saveZone.center = new Geom.Point(0,0);
    }

    initListeners(){
        const controller = document.createElement('div');
        controller.id = 'controller';

        const controller_center = document.createElement("div");
        controller_center.id = 'controller_center';

        controller.append(controller_center);
        document.body.append(controller);

        controller.addEventListener('touchstart',(e)=>{
            this.startCheck = true;

            const touch = e.touches[0];

            const controllerPos = controller.getBoundingClientRect();

            const controllerPoint = {
                x:controllerPos.x + controllerPos.width/2,
                y:controllerPos.y + controllerPos.height/2,
            };

            const touchPosition = { 
                x:(touch.clientX - controllerPoint.x)/(controllerPos.width/2),
                y:(touch.clientY - controllerPoint.y)/(controllerPos.height/2),
            };

            touchPosition.y *= -1;
            this.moveFlags.right = touchPosition.x;
            this.moveFlags.up = touchPosition.y;

        });

        controller.addEventListener('touchmove',(e)=>{
            const touch = e.touches[0];

            const controllerPos = controller.getBoundingClientRect();

            const controllerPoint = {
                x:controllerPos.x + controllerPos.width/2,
                y:controllerPos.y + controllerPos.height/2,
            };

            const touchPosition = { 
                x:(touch.clientX - controllerPoint.x)/(controllerPos.width/2),
                y:(touch.clientY - controllerPoint.y)/(controllerPos.height/2),
            };
            touchPosition.y *= -1;

            this.moveFlags.right = touchPosition.x;
            this.moveFlags.up = touchPosition.y;
        });

        controller.addEventListener('touchend',(e)=>{
            this.moveFlags.right = 0;
            this.moveFlags.up = 0;
        });



        document.addEventListener('keydown', (e)=>{
            this.startCheck = true;
            if(e.code === 'ArrowRight') this.moveFlags.right = 1;
            if(e.code === 'ArrowLeft') this.moveFlags.right = -1;
            if(e.code === 'ArrowUp') this.moveFlags.up = 1;
            if(e.code === 'ArrowDown') this.moveFlags.up = -1;
        });
        document.addEventListener('keyup', (e)=>{
            if(e.code === 'ArrowRight') this.moveFlags.right = 0;
            if(e.code === 'ArrowLeft') this.moveFlags.right = 0;
            if(e.code === 'ArrowUp') this.moveFlags.up = 0;
            if(e.code === 'ArrowDown') this.moveFlags.up = 0;
        });
    };

    move(){
        const shift = new Geom.Point(0,0)
        if(this.moveFlags.right) shift.x += this.moveFlags.right;
        // if(this.moveFlags.left) shift.x -= 1;
        if(this.moveFlags.up) shift.y -= this.moveFlags.up;
        // if(this.moveFlags.down)  shift.y += 1;

        const point = new Geom.Point(this.point.x + shift.x,this.point.y + shift.y);




        if(shift.x || shift.y){
            const vector = new Geom.Vector(this.point,point).normalizeThis();
            const oldPoint = new Geom.Point(this.point.x, this.point.y);

            const newPoint = new Geom.Point(this.point.x + vector.x * this.speed*1.2, this.point.y + vector.y * this.speed*1.2);
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
            if(ray.length - closestDist < 0){
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