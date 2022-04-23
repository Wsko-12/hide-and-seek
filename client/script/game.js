import {MAIN} from "./main.js";
import {Player} from "./player.js";
import * as Geom from "./geometry.js";


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
        this.id = data.id;
        this.members = data.players;
        this.players = data.players.map(member => {
            return new Player(member)
        });
        this.mapSize = 1024;
        
        MAIN.game = this;

        const canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.width = canvas.height = this.mapSize;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        document.body.append(canvas);

        this.lines = [];
        this.generateLines(data.seed);

        this.render();
    };

    generateLines(seed){
        const random = new Random(1);
        const length = 32;
        this.mapLines = [];

        //сначала просто создаем кучу линий
        for(let y = 0; y<this.mapSize/64;y++){
            this.mapLines[y] = []
            for(let x = 0; x<this.mapSize/64;x++){
                this.mapLines[y][x] = 0;
                let dirIndex = Math.round(random.get()*3);
                const shift = this.mapSize/4;
                const start = new Geom.Point(x*length + shift,y*length+ shift);
                let line;
                
                switch (dirIndex){
                    case 0:
                        //go up
                        line = new Geom.Line(start,(x)*length+shift,(y-1)*length+shift);
                        break;
                    case 1:
                        //go right
                        line = new Geom.Line(start,(x+1)*length+shift,(y)*length+shift);
                        break;
                    case 2:
                        //go down
                        line = new Geom.Line(start,(x)*length+shift,(y+1)*length+shift);
                        break;
                    case 3:
                        //go left
                        line = new Geom.Line(start,(x-1)*length+shift,(y)*length+shift);
                        
                        break;
                };
                line.dirIndex = dirIndex;
                this.mapLines[y][x] = line;
            };
        };

        this.lines2 = [];

        //потом объединяем 
        for(let y = 0; y<this.mapSize/64;y++){
            for(let x = 0; x<this.mapSize/64;x++){
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
                                this.lines.push(thisLine);
                            }
                        }else{
                            this.lines.push(thisLine);
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
                                this.lines.push(thisLine);
                            }
                        }else{
                            this.lines.push(thisLine);
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
                                this.lines.push(thisLine);
                            }
                        }else{
                            this.lines.push(thisLine);
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
                                // this.lines.push(thisLine);
                            }
                        }else{
                            // this.lines.push(thisLine);
                        };
                        
                        break;
                };

            }
        }


    };
    render = ()=>{
        
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

        this.players.forEach(player => {
            player.draw(this.ctx);
        });

        this.lines.forEach(line => {
            const ctx = this.ctx;
            ctx.strokeStyle = `#303030`;

            ctx.beginPath(); 
            ctx.moveTo(line.start.x , line.start.y);

            ctx.lineWidth = 1;
            ctx.lineTo(line.end.x , line.end.y);
            ctx.stroke();  
        });

        MAIN.player.move();
        requestAnimationFrame(this.render);
    };
};

export {Game};