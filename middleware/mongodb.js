import mongoose from 'mongoose';
import Cors from 'cors';

const MONGODB_URL = process.env.HOST_NAME === 'localhost' ? process.env.MONGODB_URL_LOCAL : process.env.MONGODB_URL;

const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
})

function runCors(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

const runMidldleware = handler => async (req, res) => {

    await runCors(req, res, cors)

    if (mongoose.connections[0].readyState) {
        return handler(req, res);
    }
    await mongoose.connect(MONGODB_URL, {
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true
    });

    return handler(req, res);
};

export default runMidldleware;