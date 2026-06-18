import Department from "../models/department.model";
import Faculty from "../models/faculty.model";

export const getMyDepartments = async (facultyId: number) => {
 const departments = await Department.findAll({
  where: {
    facultyId,
  },
  attributes: ["id", "name"],
  order: [["name", "ASC"]],
});

  return departments;
};