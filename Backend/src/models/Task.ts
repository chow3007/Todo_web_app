import { DataTypes } from "sequelize";
import SequelizeConfig from "../config/db.config.js";

const Task = SequelizeConfig.define("task",{
 id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
 title: {
    type: DataTypes.STRING,
    allowNull: false,
 },
 discription: {
    type: DataTypes.STRING,
    allowNull: false,
 },
 status: {
    type:DataTypes.ENUM("yet","ongoing","completed"),
    allowNull: false,
 }
});

export default Task;

