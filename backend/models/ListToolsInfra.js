import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;
const ListToolsModel = db.define(
    "tools_list", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name_tools: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type_tools: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total_tools: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        spec_tools: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    }
);


export default ListToolsModel;