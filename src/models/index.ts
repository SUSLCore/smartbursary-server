
import Faculty from "./faculty.model";
import Department from "./department.model";
import User from "./user.model";

Faculty.hasMany(Department, { foreignKey: "facultyId" });
Department.belongsTo(Faculty, { foreignKey: "facultyId" });

Faculty.hasMany(User, { foreignKey: "facultyId" });
User.belongsTo(Faculty, { foreignKey: "facultyId" });

Department.hasMany(User, { foreignKey: "departmentId" });
User.belongsTo(Department, { foreignKey: "departmentId" });

export { Faculty, Department, User };