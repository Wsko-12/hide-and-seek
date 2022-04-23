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
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.r, 0, 2 * Math.PI);
        ctx.fill();

        const closestColliders = this.closest;

        const angle = this.player.angle;
        const rays = 180;
        const step = 360/rays;
        const finalPoints = [];

        for(let i = -this.angleField/2; i < this.angleField/2; i++){
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
            if(closest){
                finalPoints.push(closest);
            }else{
                finalPoints.push(end);
            };
        };
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.moveTo(this.center.x,this.center.y);
        // ctx.moveTo(finalPoints[0].x,finalPoints[0].y);
        for(let i = 0; i<finalPoints.length;i++){
            const point = finalPoints[i];
            ctx.lineTo(point.x,point.y);
        }
        ctx.fill();
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
}

export {ViewCircle};