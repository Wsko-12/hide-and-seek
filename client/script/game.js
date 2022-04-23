import {MAIN} from "./main.js";
import {Player} from "./player.js";

class Random{
    constructor(seed){
        this.m = 4294967296;
        this.a = 1664525;
        this.c = 1013904223;

        if(!seed) seed = Math.random();
        this.z = (seed*this.a+this.c) % this.m;
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
        })
        this.generateMap(data.seed);
        this.mapSize = 256;
        MAIN.game = this;

        const canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.width = 256;
        canvas.height = 256;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        document.body.append(canvas);
        this.render();
    };

    generateMap(){
        this.map = [];
        for(let y = 0; y<this.mapSize/2;y++){
            this.map[y] = [];
            for(let x = 0; x<this.mapSize/2;x++){
                this.map[y][x] = null;
            }
        }


    };
    render = ()=>{
        
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

        this.players.forEach(player => {
            player.draw(this.ctx);
        });
        MAIN.player.move();
        requestAnimationFrame(this.render);
    };
};

export {Game};