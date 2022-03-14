const path = require('path');

module.exports = {
    env: {
        HOST_NAME: 'production',
        HOST_NAME: 'localhost',

        MONGODB_URL_LOCAL: 'mongodb://localhost:27017/nextjs',
        MONGODB_URL: 'mongodb://localhost:27017/nextjs',

        API_URL_LOCAL: 'http://localhost:3000/api/',
        API_URL: 'https://web.com.vn/api/',

        ORIGIN_LOCAL: 'http://localhost:3000/',
        ORIGIN: 'https://web.com.vn/',

        FOLDER_UPLOAD: 'upload',

        FILE_SIZE_LIMIT: 1024 * 1024 * 5,
        TITLE: 'NextJS',

        GOOGLE_CLIENT_ID: 'appID.apps.googleusercontent.com',
        FACEBOOK_CLIENT_ID: 'appID',

        EMAIL_SERVICE: 'gmail',
        EMAIL_USER: 'email@gmail.com',
        EMAIL_PASS: '12345678'
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
    },
    image: {
        minimumCacheTTL: 60,
    }
};