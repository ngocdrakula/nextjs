module.exports = {
    env: {
        HOST_NAME: 'production',
        // HOST_NAME: 'localhost',
        MONGODB_URL: "mongodb+srv://Trang8:AdminTrang8@trang8-cepg4.mongodb.net/visualizer?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true",
        // MONGODB_URL: "mongodb://localhost:27017/visualizer",
        API_URL: 'https://reallyvirtual.herokuapp.com/api/',
        // API_URL: 'http://localhost:3000/api/',
        FOLDER_UPLOAD: 'upload',
        // FOLDER_UPLOAD: 'upload/images',
        CLOUD_NAME: 'ngocdrakula',
        CLOUD_API_KEY: '143468887975713',
        CLOUD_API_SECRET: "djPJ1bP4VSXopkCDrlZ9cOCLYWk",
        FILE_SIZE_LIMIT: 1024 * 1024 * 5,
        CLOUD_PATH: "photo/",
        CLOUD_URL_ORIGIN: "http://res.cloudinary.com/ngocdrakula/image/upload/photo/"
    }
};