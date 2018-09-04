module.exports = {
    development: {
      dialect: "sqlite",
      storage: "./db.development.sqlite"
    },
    test: {
      dialect: "sqlite",
      storage: ":memory:"
    },
    production: {
      username: "postgres", //process.env.DB_USERNAME,
      password: "test123", //process.env.DB_PASSWORD,
      database: "test", //process.env.DB_NAME,
      host: "localhost:5432", //process.env.DB_HOSTNAME,
      dialect: "postgres", //'mysql',
      use_env_variable: 'DATABASE_URL'
    }
};