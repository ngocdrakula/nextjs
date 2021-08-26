import io from 'socket.io-client';

const ORIGIN = process.env.HOST_NAME === 'localhost' ? process.env.ORIGIN_LOCAL : process.env.ORIGIN;

const socket = io(ORIGIN);


export default socket;