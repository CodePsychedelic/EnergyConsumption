module.exports = {
  apps : [{
    name: 'API',
    script: 'server.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    instances: 4,
    autorestart: true,
    watch: false,
    max_memory_restart: '4G',
    env: {
      NODE_ENV: 'development',
      URL: "http://localhost:8765",
      PORT: "8765",
      HOME: "/energy/api",
      MONGO_ATLAS_PW : "123",
      JWT_KEY: "secret",
      MONGO_CONNECT: "mongodb://localhost:27017/softeng?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
    },
    env_production: {
      NODE_ENV: 'production',
      URL: "http://localhost:8765",
      PORT: "8765",
      HOME: "/energy/api",
      MONGO_ATLAS_PW : "123",
      JWT_KEY: "secret",
      MONGO_CONNECT: "mongodb://localhost:27017/softeng?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
      
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : 'localhost',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : 'H:\H\h\HMMY\HMMY\5th Year\9o eksamhno\Soft Tech\Soft_tech_ergasia\MY_SOFTENG_PROJECT\TL19-35\back-end',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
