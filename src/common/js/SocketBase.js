import io from 'socket.io-client';
export default class SocketBase {
    constructor(host="http://192.168.1.217:3000") {
        this.socket = io(host);
        //
        let socket = this.socket;

        socket.on('connect', () => {
            console.log("连接服务器成功！");
        });
        socket.on('disconnect', () => {
            console.log("与服务器断开连接！");
        });
    }

    on(event,callBack){
        this.socket.on(event,callBack);
    }

    emitEvent(event, data) {
        this.socket.emit(event, data);
    }
}