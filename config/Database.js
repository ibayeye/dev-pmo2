import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();
// const db = new Sequelize("indodaya", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

const db = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.PORT,
  dialect: "mysql",
});

export default db;
