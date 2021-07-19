module.exports = {
    env: {
        // HOST_NAME: 'localhost', 
        HOST_NAME: 'production',

        MONGODB_URL: "mongodb://localhost:27017/visualizer",

        // API_URL: 'http://localhost:3000/api/', 

        API_URL: 'http://visualizer.hungtin.vn/api/',

        FOLDER_UPLOAD: 'upload',

        FILE_SIZE_LIMIT: 1024 * 1024 * 5,
        TITLE: 'visualizer.hungtin.vn'
    }
};