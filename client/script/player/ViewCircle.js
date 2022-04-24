import * as Geom from "../geometry.js";
import {MAIN} from "../main.js";

class ViewCircle extends Geom.Circle{
    constructor(player,r){
        super(player.point,r);
        this.closest = [];
        this.player = player;
        this.angleField = 160;

       
    }

    draw(ctx){
        // ctx.fillStyle = 'rgba(255,255,255,0.1)';
        // ctx.beginPath();
        // ctx.arc(this.center.x, this.center.y, this.r, 0, 2 * Math.PI);
        // ctx.fill();

        const closestColliders = this.closest;

        const angle = this.player.angle;
        const rays = 50;
        const step = this.angleField/rays;
        const finalPoints = [];

        for(let i = -this.angleField/2; i < this.angleField/2; i+=step){
            let closest = null;
            let closestDist = Infinity;
            const angleCur = new Geom.Angle(angle.deg + i);
            const end = this.center.pointСircle(this.r,angleCur.deg);
            let ray = new Geom.Ray(this.center,end);
            closestColliders.forEach(collider =>{
                const intersect = ray.checkIntersection(collider);
                if(intersect){
                    const dist = this.center.getDistanceTo(intersect);
                    if(dist < closestDist){
                        closestDist = dist;
                        closest = intersect;
                    };
                };
            });
            if(this.player.buff === 'Xray'){
                finalPoints.push(end);
                continue;
            };
            if(closest){
                finalPoints.push(closest);
            }else{
                finalPoints.push(end);
            };
        };
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.moveTo(this.center.x,this.center.y);
        for(let i = 0; i<finalPoints.length;i++){
            const point = finalPoints[i];
            ctx.lineTo(point.x,point.y);
        }
        ctx.fill();

        this.checkEnemy();
    };

    

    findClosestCollidersPoints(colliders){
        const closest = [];
        colliders.forEach(collider => {
            if(collider.isClose(this)){
                closest.push(collider);
            };
        });
        this.closest = closest;
    };

    checkEnemy(){
        for(let i=0;i<MAIN.game.players.length;i++){
            const enemy = MAIN.game.players[i];
            if(enemy.state.team === MAIN.player.state.team) continue;
            if(enemy.buff === 'Invisible') continue;


            const enemyVector = new Geom.Vector(this.center,enemy.point);
            const viewVector = new Geom.Vector(this.center,this.center.pointСircle(this.r, this.player.angle.deg));
            
            const dot = enemyVector.dotProduct(viewVector);

            const cos = dot / (enemyVector.length*viewVector.length);
            const angleBtwVectors = Math.acos(cos) * 180/Math.PI;

            if(angleBtwVectors > this.angleField/2){
                enemy.state.visible = false;
                continue;
            };

            const enemyCircle = new Geom.Circle(enemy.point,5);
            const ray_0 = new Geom.Ray(this.center, enemy.point);

            if(ray_0.length > this.r){
                enemy.state.visible = false;
                continue;
            };

            let intersect = false;

            
            this.closest.forEach((collider)=>{
                const intersect_0 = ray_0.checkIntersection(collider);
                if( intersect_0){
                    intersect = true;
                };
            });
            if(this.player.buff === 'Xray') intersect = false;

            
            enemy.state.visible = !intersect;
            if(this.player.startCheck){
                if(!intersect){
                    const timeStamp = Date.now();
                    MAIN.player.state.detected[enemy.login] = timeStamp;
                    const data = {
                        gameID:MAIN.game.id,
                        enemy:enemy.login,
                        player:MAIN.player.login,
                        timeStamp,
                    };
                    MAIN.socket.emit('ENEMY_find',data);
                };
            };


        }
    }
}

export {ViewCircle};