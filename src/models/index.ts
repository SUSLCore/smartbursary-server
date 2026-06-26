
import Faculty from "./faculty.model";
import Department from "./department.model";
import User from "./user.model";
import Batch from "./batch.model";
import EligibleStudent from "./eligibleStudent.model";
import MonthlyDocument from "./monthlyDocument.model";
import DocumentHistory from "./documentHistory.model";

Faculty.hasMany(Department, { foreignKey: "facultyId" });
Department.belongsTo(Faculty, { foreignKey: "facultyId" });

Faculty.hasMany(User, { foreignKey: "facultyId" });
User.belongsTo(Faculty, { foreignKey: "facultyId" });

Department.hasMany(User, { foreignKey: "departmentId" });
User.belongsTo(Department, { foreignKey: "departmentId" });

Batch.hasMany(EligibleStudent, {foreignKey: "batchId",});
EligibleStudent.belongsTo(Batch, {foreignKey: "batchId",});

MonthlyDocument.hasMany(DocumentHistory, {
  foreignKey: "documentId",
  as: "history",
});

DocumentHistory.belongsTo(MonthlyDocument, {
  foreignKey: "documentId",
});

User.hasMany(DocumentHistory, {
  foreignKey: "uploadedBy",
});

DocumentHistory.belongsTo(User, {
  foreignKey: "uploadedBy",
});

export {
  Faculty,
  Department,
  User,
  Batch,
  EligibleStudent,
  MonthlyDocument,
  DocumentHistory,
};