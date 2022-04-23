const ID = require('./id');
const MAIN = require('../app');
class Player{
    constructor(user,data){
        this.login = user.login;
        this.socket = user.socket;
        this.role = data.role;
        this.position = {x:0,y:0};
    };

    emit(msg,data){
        this.socket.emit(msg,data);
    };
};

module.exports.Player = Player;