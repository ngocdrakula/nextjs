module.exports = {
    apps: [
        {
            name: "visualizer",
            script: "./server.js",
            watch: true,
            interpreter: ".npm/yarn", //absolute path to yarn ; default is node
            interpreter_args: "",
            exec_mode: "cluster",
            cwd: "", //the directory from which your app will be launched
            args: "", //string containing all arguments passed via CLI to script
            env_development: {
                "PORT": 3000,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8000,
                "NODE_ENV": "production",
            }
        }
    ]
}