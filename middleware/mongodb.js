import mongoose from 'mongoose';
import Cors from 'cors';
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
                console.log('error')
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
    await mongoose.connect(process.env.MONGODB_URL, {
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true
    });

    return handler(req, res);
};

export default runMidldleware;