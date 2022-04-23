const ID = require('./id');
const MAIN = require('../app');
class User{
    constructor(data){
        this.login = data.login;
        this.socket = data.socket;
    };
};

module.exports.User = User;