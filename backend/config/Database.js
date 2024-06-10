import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();
// const db = new Sequelize("indodaya", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

const db = new Sequelize({
  host: process.env.DEV_DB_HOST,
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_DATABASE,
  port: process.env.DEV_DB_PORT,
  dialect: "mysql",
});

export default db;