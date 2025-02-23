require('dotenv').config();
const SequelizeAuto = require("sequelize-auto");

const auto = new SequelizeAuto(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: 3306,
  logging: false,
});

auto.run().then((data) => {
  console.log(data.tables);
  console.log(data.foreignKeys);
}).catch(err => {
  console.error("Erro ao executar SequelizeAuto:", err);
});
