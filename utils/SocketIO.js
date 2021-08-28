import io from 'socket.io-client';

const ORIGIN = process.env.HOST_NAME === 'localhost' ? process.env.ORIGIN_LOCAL : process.env.ORIGIN;

class SocketIO {
    constructor() {
        this.socket = {};
    }
    start() {
        this.socket = io(ORIGIN);
    }

}

export default new SocketIO();