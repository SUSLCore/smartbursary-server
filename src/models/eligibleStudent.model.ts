import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class EligibleStudent extends Model {}

EligibleStudent.init(
{
 id:{
  type:DataTypes.INTEGER,
  autoIncrement:true,
  primaryKey:true
 },

 uploadId:{
  type:DataTypes.INTEGER,
  allowNull:false
 },

 facultyId:{
  type:DataTypes.INTEGER,
  allowNull:false
 },

 departmentId:{
  type:DataTypes.INTEGER,
  allowNull:false
 },

 registerId:{
  type:DataTypes.STRING,
  allowNull:false
 },

 studentName:{
  type:DataTypes.STRING,
  allowNull:false
 },

 batchYear:{
  type:DataTypes.STRING
 },

 semester:{
  type:DataTypes.STRING
 },

 accountNumber:{
  type:DataTypes.STRING
 },

 branchCode:{
  type:DataTypes.STRING
 },

 amount:{
  type:DataTypes.DECIMAL(10,2)
 },

 recommendation:{
  type:DataTypes.BOOLEAN,
  defaultValue:true
 },

 isEligible:{
  type:DataTypes.BOOLEAN,
  defaultValue:true
 }
},
{
 sequelize,
 tableName:"eligible_students",
 timestamps:true,
 indexes:[
  {
   unique:true,
   fields:["departmentId", "batchId","registerId"]
  }
 ]
}
);

export default EligibleStudent;