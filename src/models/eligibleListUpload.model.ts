import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface EligibleListUploadAttributes {
  id: number;
  batchId: number;
  facultyId: number;
  departmentId: number;
  uploadedBy: number;
  fileName: string;
  totalStudents: number;
}

interface EligibleListUploadCreationAttributes
  extends Optional<
    EligibleListUploadAttributes,
    "id"
  > {}

class EligibleListUpload
  extends Model<EligibleListUploadAttributes,EligibleListUploadCreationAttributes>
  implements EligibleListUploadAttributes
{
  public id!: number;
  public batchId!: number;
  public facultyId!: number;
  public departmentId!: number;
  public uploadedBy!: number;
  public fileName!: string;
  public totalStudents!: number;
}

EligibleListUpload.init(
{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },

  batchId:{
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

  uploadedBy:{
    type:DataTypes.INTEGER,
    allowNull:false
  },

  fileName:{
    type:DataTypes.STRING,
    allowNull:false
  },

  totalStudents:{
    type:DataTypes.INTEGER,
    defaultValue:0
  }
},
{
 sequelize,
 tableName:"eligible_list_uploads",
 timestamps:true
}
);

export default EligibleListUpload;