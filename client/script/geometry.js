const NUMBERS_PREC = 4;
const DEGS_PREC = 4;
const RADS_PREC = 7;

export class Point{
    constructor(x,y){
        this.x = Number.parseFloat(x.toFixed(NUMBERS_PREC));
        this.y = Number.parseFloat(y.toFixed(NUMBERS_PREC));
    };

    vecToPoint(x,y){
        if(x instanceof Point){
            return new Vector(this,x);
        }else{
            return new Vector(this,x,y);
        };                
    };

    vecToAngle(angle,rad,length = 1){
        /*
            **test**
            
            let p = new Point(1,1);
            p.vecToAngle(30);

            let p = new Point(1,1);
            p.vecToAngle(null,1.5708);

            let p = new Point(1,1);
            p.vecToAngle(new Angle(30));



        
        
        
        */

        if(!(angle instanceof Angle)){
            angle = new Angle(angle,rad);
        };

        const point = this.pointСircle(length,angle);

        return new Vector(this, point);
    };

    rayToAngle(angle,rad,length = 1){
        const vec = this.vecToAngle(angle,rad,length);
        return new Ray(vec.start,vec.end);
    };

    pointСircle(r,angle,rad){
        let x,y;
        if(!(angle instanceof Angle)){
            if(angle === null){
                angle = new Angle(null,rad);
            }else{
                angle = new Angle(angle);
            };
        };
        x = r * Math.cos(angle.rad);
        y = r * Math.sin(angle.rad);
        x = Number.parseFloat(x.toFixed(NUMBERS_PREC));
        y =  Number.parseFloat(y.toFixed(NUMBERS_PREC));

        return new Point(x + this.x, y + this.y);
    };

    anglePoint(x,y){
        if(x instanceof Point){
            y = x.y;
            x = x.x;
        };
        let deg;
        const Px = x - this.x; //2
        const Py = y - this.y;
        if(Py === 0){
            deg = (Px >= 0) ? 0 : 180
        }else{
            const degAtan = Math.atan(Py/Px) * 180/Math.PI;
            if(Px >= 0){
                deg = (Py >= 0) ? degAtan : degAtan + 360;
            }else{
                deg = degAtan + 180;
            };
        };  
        deg = Number.parseFloat(deg.toFixed(DEGS_PREC));
        return new Angle(deg);

        /*
            **test**
            let p = new Point(4,3)
            let ang = {
                _0:p.anglePoint(6,3).deg,
                _15:p.anglePoint(5.93,3.52).deg,
                _30:p.anglePoint(5.73,4).deg,
                _45:p.anglePoint(5.41,4.41).deg,
                _90:p.anglePoint(4,5).deg,
                _135:p.anglePoint(2.59,4.41).deg,
                _180:p.anglePoint(2,3).deg,
                _185:p.anglePoint(2.01,2.83).deg,
                _225:p.anglePoint(2.59,1.59).deg,
                _240:p.anglePoint(3,1.27).deg,
                _270:p.anglePoint(4,1).deg,
                _315:p.anglePoint(5.41,1.59).deg,
                _330:p.anglePoint(5.73,2).deg,
                _340:p.anglePoint(5.88,2.32).deg,
            }
            console.log(ang);
        
        */
    };


    getDistanceTo(point,y){
                // or x,y
        if(! (point instanceof Point)){
            point = new Point(point,y);
        };

        const _x = this.x - point.x;
        const _y = this.y - point.y;

        const value = Math.sqrt((_x**2) + (_y**2));
        return Number.parseFloat(value.toFixed(NUMBERS_PREC));
    };
};


export class Angle{
      /*
            **test**
            let ang = {
                _0:new Angle(0).deg,
                _60:new Angle(60).deg,
                _117:new Angle(-8883).deg,
                _200:new Angle(1640).deg,
                _240:new Angle(600).deg,
                _243:new Angle(8883).deg,
                _270:new Angle(-450).deg,
                _290:new Angle(-790).deg,
                _330:new Angle(-390).deg,

                
                r_0:new Angle(null,0).deg,
                r_60:new Angle(null,1.0472).deg,
                r_117:new Angle(null,-155.0376).deg,
                r_200:new Angle(null,28.6234).deg,
                r_240:new Angle(null,10.472).deg,
                r_243:new Angle(null,155.0376).deg,
                r_270:new Angle(null,-7.85398).deg,
                r_290:new Angle(null,-13.7881).deg,
                r_330:new Angle(null,-6.80678).deg,


                n_330:new Angle().normalize(-390).deg,

                i_30:new Angle(330).inc(60).deg,
                i_300:new Angle(330).inc(-30).deg,

                ir_0:new Angle(null,5.7595).inc(null,0.523599).deg,
                ir_300:new Angle(null,5.7595).inc(null,-0.523599).deg,
                
            }
            console.log(ang);
        */

    constructor(deg,rad){
        if(deg != null){
            this.deg = Number.parseFloat(deg.toFixed(DEGS_PREC));
            this.rad =  this.deg * Math.PI/180;
            this.rad = Number.parseFloat(this.rad.toFixed(RADS_PREC));
        }else{
            if(rad == undefined){
                this.rad = 0;
                this.deg = 0;
            }else{
                this.rad = Number.parseFloat(rad.toFixed(RADS_PREC));
                this.deg =  this.rad * 180/Math.PI;
                this.deg = Number.parseFloat(this.deg.toFixed(DEGS_PREC));
            };
        };
        this.normalize();
    };

    normalize(deg,rad){
        if(deg === undefined){
            return this.normalizeThis();
        };
        // 395deg -> 35deg
        let nD, nR;
        if(deg != null){
            if(deg >= 0){
                nD = deg%360;
            }else{
                nD = 360 + (deg%360);
            };

            if(deg == undefined){
                nR = 0;
                nD = 0;
            }else{
                nD = Number.parseFloat(nD.toFixed(DEGS_PREC));
                nR = nD * Math.PI/180;
                nR = Number.parseFloat(nR.toFixed(RADS_PREC));
            };
            

        }else{
            if(rad >= 0){
                nR = rad % (Math.PI*2);
            }else{
                nR = (Math.PI*2) + (rad % (Math.PI*2))
            };

            //if all is undefined
            if(rad == undefined){
                nR = 0;
                nD =0;
            }else{
                nR = Number.parseFloat(nR.toFixed(RADS_PREC));
                nD = nR * 180/Math.PI;
                nD = Number.parseFloat(nD.toFixed(DEGS_PREC));
            };

        };

        return {
            deg:nD,
            rad:nR,
        };
    };

    normalizeThis(){
        const n = this.normalize(this.deg,this.rad);
        this.deg = n.deg;
        this.rad = n.rad;
        return this;
    };

    inc(deg,rad){
        if(deg!=null){
            this.deg += deg;
            this.rad +=  this.deg * Math.PI/180;
            this.deg = Number.parseFloat(this.deg.toFixed(DEGS_PREC));
            this.rad = Number.parseFloat(this.rad.toFixed(RADS_PREC));
        }else{
            this.rad += rad;
            this.deg = this.rad * 180/Math.PI;
            this.deg = Number.parseFloat(this.deg.toFixed(NUMBERS_PREC));
            this.rad = Number.parseFloat(this.rad.toFixed(DEGS_PREC));
        }
        this.normalizeThis();
        return this;
    };

    getInc(deg,rad){
        return new Angle(this.deg).inc(deg,rad);
    };

};


export class Line{
    constructor(start,end,x2,y2){
        //start:Point; end : Point;
        //start: Point, end: x_2, x2: y_2;
        //start: x_1; end: y_1; x2: Point,
        //start: x_1; end: y_1; x2: x_2; y2: y_2


        /* **test**
            let point_1 = new Point(0,0);
            let point_2 = new Point(2,2);

            let x1 = 0;
            let y1 = 0;
            let x2 = 2;
            let y2 = 2;


            testArr = [
                new Line(point_1,point_2),
                new Line(point_1,x2,y2),
                new Line(x1,y1,point_2),
                new Line(x1,y1,x2,y2),
            ]
            
            function test(){
                for(let i=0;i<testArr.length;i++){
                    const line = testArr[i];
                    console.log(line)
                };
            };
            test();
        
        */

        if(start instanceof Point){
             //start:Point; end : Point;
            this.start = start;
            
            if(end instanceof Point){
                
                this.end = end;
            }else{
                //start: Point, end: x_2, y_2;
                this.end = new Point(end, x2);
            };
        }else{
             //start: x_1; end: y_1; x2: Point,
            this.start = new Point(start,end);
            
            if(x2 instanceof Point){
                this.end = x2;
            }else{
                 //start: x_1; end: y_1; x2: x_2; y2: y_2
                 this.end = new Point(x2,y2);
            };
        };

        const x = this.start.x-this.end.x;
        const y = this.start.y-this.end.y;
        this.length = this.getLength();
    };

    getLength(){
        return this.start.getDistanceTo(this.end);
    };


    extendOn(point,y){
        if(!(point instanceof Point)){
            point = new Point(point,y);
        };

        this.end = point;
        this.length = this.getLength();
        return this;
    };

    extendBy(value){
        const angle = this.start.anglePoint(this.end);
        this.end = this.end.pointСircle(value,angle);
        this.length = this.getLength();
        return this;
    };
};


export class Vector extends Line{
    /* **test**
            let point_1 = new Point(0,0);
            let point_2 = new Point(2,2);

            let x1 = 0;
            let y1 = 0;
            let x2 = 2;
            let y2 = 2;


            testArr = [
                new Vector(point_1,point_2),
                new Vector(point_1,x2,y2),
                new Vector(x1,y1,point_2),
                new Vector(x1,y1,x2,y2),
            ]
            
            function test(){
                for(let i=0;i<testArr.length;i++){
                    const vector = testArr[i];
                    console.log(vector)
                };
            };
            test();
        
        */
    constructor(start,end,x2,y2){
        super(start,end,x2,y2);
        
        this.x = this.end.x - this.start.x;
        this.y = this.end.y - this.start.y;
    };

    dotProduct(vec){
        return this.x*vec.x + this.y*vec.y;
    };



    normalize(vec){
        if(!vec){
            this.normalizeThis();
            return;
        };
        vec = new Vector(vec.start,vec.end);
        vec.x = vec.x / vec.length;
        vec.y = vec.y /vec.length;
        vec.x = Number.parseFloat(vec.x.toFixed(NUMBERS_PREC));
        vec.y = Number.parseFloat(vec.y.toFixed(NUMBERS_PREC));
        return vec;
    };

    normalizeThis(){
        const n = this.normalize(this);
        this.x = n.x;
        this.y = n.y;
        return this;
    };

    extendOn(point,y){
        super.extendOn(point,y);
        this.x = this.end.x - this.start.x;
        this.y = this.end.y - this.start.y;
    };

    extendBy(value){
        super.extendBy(value);
        this.x = this.end.x - this.start.x;
        this.y = this.end.y - this.start.y;
    };

    projectTo(vec){
        const dot = this.dotProduct(vec);
        const value = dot/vec.length;
        return Number.parseFloat(value.toFixed(NUMBERS_PREC));
        
    };
    getPointByDist(length){
       const k = Number.parseFloat((length/this.length).toFixed(NUMBERS_PREC));
       let x = this.start.x + (this.end.x - this.start.x)*k;
       let y = this.start.y + (this.end.y - this.start.y)*k;

       return new Point(x,y);
    };
};

export class Circle{
    constructor(x,y,r){
    //or (Point,r)
        if(x instanceof Point){
            this.center = x;
            this.x = x.x;
            this.y = x.y;
            this.r = y;
        }else{
            // console.log('s')
            this.x = x;
            this.y = y;
            this.r = r;
            this.center = new Point(x,y);
        };

    };


    getEdgePoints(point,y){
        //        or x,y
        // return points with point can see 
        //              .
        // p--O  --> p< O
        //              ˙
        //


        /* **test**

            let c = new Circle(7,3,2);
            let p = new Point(1,3);
            c.getEdgePoints(p)


            let c = new Circle(6,8,2);
            let p = new Point(1,3);
            c.getEdgePoints(p);

            let c = new Circle(6,8,4);
            let p = new Point(12,9);
            c.getEdgePoints(p);

            let c = new Circle(6,8,4);
            let p = new Point(-34.08,-42.06);
            c.getEdgePoints(p);

        */
        if(!(point instanceof Point)){
            point = new Point(point,y);
        };

        const dist = point.getDistanceTo(this.center);
        const newVectorsDist = Number.parseFloat(Math.sqrt(dist**2 + this.r**2).toFixed(NUMBERS_PREC));
        

        const angleBias = Number.parseFloat(Math.atan(this.r/dist).toFixed(RADS_PREC));
        
        const angleFromPoint = point.anglePoint(this.center);
        
        const angVec_1 = angleFromPoint.getInc(null,angleBias);
        const angVec_2 = angleFromPoint.getInc(null,-angleBias);

        const point_1 = point.pointСircle(newVectorsDist,angVec_1);
        const point_2 = point.pointСircle(newVectorsDist,angVec_2);
        return [point_1,point_2];
    };
};


export class Ray extends Vector{
    constructor(start,end,x2,y2){
        super(start,end,x2,y2);
    };

    checkIntersection(figure, inf){
        // inf - means doesn't check ray length;

        if(figure instanceof Circle){
            /* 
                a - start point;
                c - center circle;
                s - end of vector;

                t - point of projection AC to AS;
                p - searched point;




                ** test **
                let circle = new Circle(6,7,2);
                let point = new Point(2,4);
                let shoot = new Point(9.7,6.64);

                console.log(new Ray(point,shoot).checkIntersection(circle),'x:5.3','y:5.13');

                circle = new Circle(8,14,3);
                point = new Point(-10,20);
                shoot = new Point(16.13,9.15);

                console.log(new Ray(point,shoot).checkIntersection(circle),'x:5.01','y:13.77');

                circle = new Circle(8,14,3);
                point = new Point(-10,20);
                shoot = new Point(12.97,4.86);

                console.log(new Ray(point,shoot).checkIntersection(circle),'false');

                circle = new Circle(8,14,3);
                point = new Point(16.84,18.49);
                shoot = new Point(6.21,10.26);

                console.log(new Ray(point,shoot).checkIntersection(circle),'x:10.99','y:13.96');

                circle = new Circle(8,14,3);
                point = new Point(12,20);

                console.log(point.rayToAngle(225,null,2.83).checkIntersection(circle),'false');
                console.log(point.rayToAngle(222.28,null,7.64).checkIntersection(circle),'x:8.63','y:16.93');
                console.log(point.rayToAngle(222.28,null,2.83).checkIntersection(circle),'x:8.63','y:16.93');



                **NEW TESTS**

                **situation when start point inside the circle**
                let cir = new G.Circle(5,5,2);
                let ray = new G.Ray(5,4,8,7);
                console.log(ray.checkIntersection(cir),'x:6.82:y:5.82;')
            */

           const a = this.start;
           const c = figure.center;
           const s = this.end;

            const AC = new Vector(a,c);
            const AT_length = AC.projectTo(this);

            const CT_length = Math.sqrt(AC.length**2 - AT_length**2);
            if(CT_length > figure.r){
                return false;
            };
            
            const PT_length = Math.sqrt(figure.r**2 - CT_length**2);

            let dist = AT_length - PT_length;

            if(dist <= 0){
                if(dist === 0){
                    return this.start;
                }else{
                    //situation when start point inside the circle
                    dist = AT_length + PT_length;
                    if(dist < 0){
                        return false;
                    }else{
                        //when all line inside the circle, its return start
                        if(dist > this.length){
                            dist = 0;
                        };
                    };
                };
            };
           
            if(dist > this.length && !inf){
                return false;
            };  
            
            return this.getPointByDist(dist);
        };


        if(figure instanceof Line){

             /* 
                ** test **
                let line = new Line(8,22,16,20);
                console.log(new Ray(10,18,12,22).checkIntersection(line),'x:11.56 y:21.11');
                console.log(new Ray(10,18,11,20).checkIntersection(line),'false');
                console.log(new Ray(10,18,11,20).checkIntersection(line,true),'x:11.56 y:21.11');

                console.log(new Ray(15,22,11,20).checkIntersection(line),'x:12.67 y:20.83');
                console.log(new Ray(15,22,7.21,21.64).checkIntersection(line),'x:9.09 y:21.73');

            */
           
            const x1 = figure.start.x;
            const y1 = figure.start.y;
            const x2 = figure.end.x;
            const y2 = figure.end.y;

            const x3 = this.start.x;
            const y3 = this.start.y;
            const x4 = this.end.x;
            const y4 = this.end.y;


            const den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
            if(den === 0){
                return false;
            };

            const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4))/den;
            const u = ((x1-x3)*(y1-y2) - (y1-y3)*(x1-x2))/den;

            if(0 < t && t < 1 && 0 < u && u < 1 || inf ){
                const x = x1+t*(x2-x1);
                const y = y1+t*(y2-y1);
                return new Point(x,y);
            }else{
                return false;
            };
        };
    };


    checkIntersectionTwoPoints(figure){
        //returns two points of intersection (for circle)

        /*
            **test**
            let cir = new G.Circle(5,5,2);
            let ray = new G.Ray(1,2,8,6);
            console.log(ray.checkIntersectionTwoPoints(cir),['x3.66:y3.52' , 'x6.96:y5.4'])

            let cir = new G.Circle(5,5,2);
            let ray = new G.Ray(1,2,6,5);
            console.log(ray.checkIntersectionTwoPoints(cir),['x3.66:y3.52' , 'x6:y5'])

            let cir = new G.Circle(5,5,2);
            let ray = new G.Ray(4,4,9,7);
            console.log(ray.checkIntersectionTwoPoints(cir),['x4:y4' , 'x6.87:y5.72'])

            let cir = new G.Circle(5,5,2);
            let ray = new G.Ray(2,7,8,7);
            console.log(ray.checkIntersectionTwoPoints(cir),'x:5:y:7; x:5:y:7')
            
        
        
        */



        if(figure instanceof Circle){
            const a = this.start;
            const c = figure.center;
            const s = this.end;

            const AC = new Vector(a,c);
            const AT_length = AC.projectTo(this);
            const CT_length = Math.sqrt(AC.length**2 - AT_length**2);
            if(CT_length > figure.r){
                return false;
            };

            const PT_length = Math.sqrt(figure.r**2 - CT_length**2);

            let dist_1 =  AT_length - PT_length;
            if(dist_1 <= 0){
                    //situation when start point inside the circle
                dist_1 = AT_length + PT_length;
                if(dist_1 < 0){
                    return false;
                }else{
                    dist_1 = 0;
                };
            };
            if(dist_1 > this.length){
                return false
            };



            let dist_2 = AT_length + PT_length;
            if(dist_2 > this.length){
                dist_2 = this.length;
            }
            // console.log(Math.abs(dist_1) > this.length);
            // if(Math.abs(dist_1) > this.length){
            //     dist_1 = 0
            // }else{
            //     return false;
            // };





            // let dist_2 = AT_length+PT_length;
            // let point_1,point_2;
            // if(dist_1 <= 0){
            //     point_1 = this.start;
            // }else{
            // };
            const point_1 = this.getPointByDist(dist_1);
            const point_2 = this.getPointByDist(dist_2);


            // if(dist_2 >= this.length){
            //     point_2 = this.end;
            // }else{
                
            // };

            return [point_1,point_2];


            // const dist = AT_length - PT_length;
            // if(dist > this.length){
            //     return false;
            // };

            // return this.getPointByDist(dist);
        };
    };
};