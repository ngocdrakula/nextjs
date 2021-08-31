module.exports = {
    env: {
        HOST_NAME: 'localhost',
        // HOST_NAME: 'production',

        MONGODB_URL_LOCAL: "mongodb://localhost:27017/vimexpo",
        MONGODB_URL: "mongodb://localhost:27017/vimexpo",

        API_URL_LOCAL: 'http://localhost:3000/api/',
        API_URL: 'https://online.vimexpo.com.vn/api/',

        ORIGIN_LOCAL: 'http://localhost:3000/',
        ORIGIN: 'https://online.vimexpo.com.vn/',

        FOLDER_UPLOAD: 'upload',

        FILE_SIZE_LIMIT: 1024 * 1024 * 5,
        TITLE: 'VIMEXPO 2021 - Triển lãm trực tuyến'
    }
};