import * as Geom from "../geometry.js";

export class LineCollider extends Geom.Line{
    constructor(x,y,x1,y1){
        super(x,y,x1,y1);
    }

    draw(ctx){
        ctx.strokeStyle = '#303030';
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();   
    };

    drawIntersect(point,ctx){
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(point.x,point.y,2,0,2*Math.PI);
        ctx.fill(); 
    };


    isClose(circle){
        const ray = new Geom.Ray(this.start,this.end);
        const intersect = ray.checkIntersection(circle);
        return intersect;
    };
}