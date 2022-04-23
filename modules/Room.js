const ID = require('./id');
class Room{
    constructor(main){
        this.id = ID.get('room',5);
        this.maxMembers = 4;
        this.members = [];
        this.MAIN = main;
    };

    add(user){
        this.members.push(user);
        this.sendRoomData();
        if(this.members.length === this.maxMembers) this.startGame();

    };

    send(msg, data){
        this.members.forEach( user =>{
            if(this.MAIN.users[user.login]){
                user.socket.emit(msg,data);
            };
        });
    };

    sendRoomData(){
        const data = {
            members:this.members.map(member => member.login),
            id:this.id,
            maxMembers:this.maxMembers,
        };
        this.send('ROOM_data',data);
    };

    startGame(){
       this.MAIN.createGame(this);
    };
};

module.exports.Room = Room;