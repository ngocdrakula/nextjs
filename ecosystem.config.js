module.exports = {
    apps: [{
        name: 'yarn',
        script: 'yarn',
        args: 'start',
        interpreter: '/bin/bash',
        env_development: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 8000,
            "NODE_ENV": "production",
        }
    }]
};