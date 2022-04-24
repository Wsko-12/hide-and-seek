import {MAIN} from "./main.js";
import * as Geom from "./geometry.js";
import {ViewCircle} from "./player/ViewCircle.js";


class Player{
    constructor(data){
        this.login = data.login;
        this.state = {
            team:data.team,
            detected:{},
            visible:false,
            inFind:false,
        };

        if(data.team){
            this.point = new Geom.Point(10,10);
        }else{
            this.point = new Geom.Point(MAIN.game.mapSize-10,MAIN.game.mapSize-10);
        }
        // this.speed = data.role ? 1.3 : 1;
        this.speed = 2;
        this.angle = new Geom.Angle(45);

        if(data.login === MAIN.user.login){
            const viewRadius = MAIN.game.mapSize/6;
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


            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }else{
            if(this.state.team === MAIN.player.state.team){
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            };
            if(this.state.visible || this.state.inFind){
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
                ctx.fill();
            };
        };
    };

    changeTeam(team){
        this.state.team = team;
        if(team === 1){
            this.point.x = 10;
            this.point.y = 10;
            MAIN.game.saveZone.center = new Geom.Point(0,0);
        }else{
            this.point.x = MAIN.game.mapSize - 10;
            this.point.y = MAIN.game.mapSize - 10;
            MAIN.game.saveZone.center = new Geom.Point( MAIN.game.mapSize, MAIN.game.mapSize);
        };
        MAIN.player.state.detected = {};
        MAIN.game.players.forEach(player =>{
            player.state.visible = false;
            player.state.inFind = false;
        });
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
        if(this.moveFlags.up) shift.y -= this.moveFlags.up;

        const point = new Geom.Point(this.point.x + shift.x,this.point.y + shift.y);




        if(shift.x || shift.y){
            const vector = new Geom.Vector(this.point,point).normalizeThis();
            const oldPoint = new Geom.Point(this.point.x, this.point.y);

            const newPoint = new Geom.Point(this.point.x + vector.x * this.speed*1.2, this.point.y + vector.y * this.speed*1.2);
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
            };
        };


        MAIN.socket.emit('GAME_position',{
            gameID:MAIN.game.id,
            player:MAIN.player.login,
            position:{x:this.point.x,y:this.point.y}
        });


    };

};

export {Player};