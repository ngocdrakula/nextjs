import io from 'socket.io-client';

const API_URL = process.env.HOST_NAME === 'localhost' ? process.env.API_URL_LOCAL : process.env.API_URL;

const socket = io(API_URL).open(e => console.log(e));


export default socket;