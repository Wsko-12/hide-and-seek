import {MAIN} from "./main.js";
import {Player} from "./player.js";
import * as Geom from "./geometry.js";
import * as Collider from "./map/collider.js";
import {SaveZone} from "./map/saveZone.js";
import {CheckPoint} from "./map/CheckPoint.js";





class Random{
    constructor(seed){
        this.m = 4294967296;
        this.a = 1664525;
        this.c = 1013904223;

        if(!seed) seed = Math.random();
        this.z = (seed*this.a+this.c) % this.m;;
    }
    get = () =>{
        this.z = (this.z * this.a+this.c) % this.m;
        return this.z / this.m;
    }
};

class Game{
    constructor(data){
        this.mapSize = 1024;
        MAIN.game = this;
        MAIN.game.catchTime = 4000;
        MAIN.game.pointTime = 5000;

        this.id = data.id;
        
        this.members = data.players;
        this.playersObj = {};
        this.players = data.players.map(member => {
            const player =  new Player(member);
            this.playersObj[player.login] = player;
            return player;
        });
        
        this.checkPoints = [-1,-1,-1].map((item,i)=>{
            return new CheckPoint(i);
        });



        this.saveZone = new SaveZone();
        const canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.width = canvas.height = this.mapSize;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        document.body.append(canvas);

        this.colliders = [];
        this.generateLines(data.seed);

        this.render();
    };

    generateLines(seed){
        const random = new Random(seed);
        const length = 64;
        this.mapLines = [];
        const labSize = this.mapSize/(length);

        //сначала просто создаем кучу линий
        for(let y = 0; y<labSize;y++){
            this.mapLines[y] = []
            for(let x = 0; x<labSize;x++){
                this.mapLines[y][x] = 0;
                let dirIndex = Math.round(random.get()*3);
                const shift = 0;


                const start = new Geom.Point(x*length + shift,y*length+ shift);
                let line;
                
                switch (dirIndex){
                    case 0:
                        //go up
                        if(y!= 0 ){
                            line = new Collider.LineCollider(start.x,start.y+5,(x)*length+shift,(y-1)*length+shift-5);
                        }else{
                            line = new Collider.LineCollider(start.x,start.y+5,start.x,start.y+5);
                        }
                        
                        break;
                    case 1:
                        //go right
                        line = new Collider.LineCollider(start.x-5,start.y,(x+1)*length+shift+5,(y)*length+shift);
                        break;
                    case 2:
                        //go down
                        line = new Collider.LineCollider(start.x,start.y-5,(x)*length+shift,(y+1)*length+shift+5);
                        break;
                    case 3:
                        //go left
                        line = new Collider.LineCollider(start.x+5,start.y,(x-1)*length+shift-5,(y)*length+shift);
                        
                        break;
                };
                line.dirIndex = dirIndex;
                this.mapLines[y][x] = line;
            };
        };

        //потом объединяем 
        // this.colliders.push(new Collider.LineCollider(0,0,this.mapSize,0));
        // this.colliders.push(new Collider.LineCollider(0,0,0,this.mapSize));
        // this.colliders.push(new Collider.LineCollider(this.mapSize,0,this.mapSize,this.mapSize));
        // this.colliders.push(new Collider.LineCollider(0,this.mapSize,this.mapSize,this.mapSize));
        for(let y = 0; y<labSize;y++){
            for(let x = 0; x<labSize;x++){
                const lineUp = y-1 >= 0 ? this.mapLines[y-1][x] : 0;
                const lineLeft = x-1 >= 0 ? this.mapLines[y][x-1] : 0;

                const thisLine = this.mapLines[y][x];

                switch (thisLine.dirIndex){
                    case 0:
                        //go up
                        if(lineUp){
                            if(lineUp.dirIndex === 0){
                                lineUp.start = thisLine.start;
                                this.mapLines[y][x] = lineUp;
                            }else if(lineUp.dirIndex === 2){
                                lineUp.end = thisLine.start;
                                this.mapLines[y][x] = lineUp;
                            }else{
                                this.colliders.push(thisLine);
                            }
                        }else{
                            this.colliders.push(thisLine);
                        };
                        break;
                    case 1:
                        //go right
                        if(lineLeft){
                            if(lineLeft.dirIndex === 1){
                                lineLeft.end = thisLine.end;
                                this.mapLines[y][x] = lineLeft;
                            }else if(lineLeft.dirIndex === 3){
                                lineLeft.start = thisLine.end;
                                this.mapLines[y][x] = lineLeft;
                            }else{
                                this.colliders.push(thisLine);
                            }
                        }else{
                            this.colliders.push(thisLine);
                        };
                        break;
                    case 2:
                        //go down
                        if(lineUp){
                            if(lineUp.dirIndex === 2){
                                lineUp.end = thisLine.end;
                                this.mapLines[y][x] = lineUp;
                            }else if(lineUp.dirIndex === 0){
                                lineUp.start = thisLine.end;
                                this.mapLines[y][x] = lineUp;
                            }else{
                                this.colliders.push(thisLine);
                            }
                        }else{
                            this.colliders.push(thisLine);
                        };
                        break;
                    case 3:
                        //go left
                        if(lineLeft){
                            if(lineLeft.dirIndex === 3){
                                lineLeft.start = thisLine.start;
                                this.mapLines[y][x] = lineLeft;
                            }else if(lineLeft.dirIndex === 1){
                                lineLeft.end = thisLine.start;
                                this.mapLines[y][x] = lineLeft;
                            }else{
                                // this.colliders.push(thisLine);
                            }
                        }else{
                            // this.colliders.push(thisLine);
                        };
                        
                        break;
                };

            }
        }

    };
    render = ()=>{
        
        this.ctx.fillStyle = 'rgb(200, 200, 200)';
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.saveZone.draw(this.ctx);

        this.checkPoints.forEach((point)=>{
            point.draw(this.ctx);
        });

        MAIN.player.draw(this.ctx);

        this.players.forEach(player => {
            if(player != MAIN.player){
                player.draw(this.ctx);
            };
        });


        this.colliders.forEach(line => {
            line.draw(this.ctx);
        });

        MAIN.player.move();
        requestAnimationFrame(this.render);
    };
};

export {Game};