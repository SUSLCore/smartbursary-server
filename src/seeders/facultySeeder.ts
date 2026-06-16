import { Faculty, Department } from "../models";

export const seedFacultiesAndDepartments = async () => {
  const faculties = [
    {
      name: "Faculty of Computing",departments: [],},
    { name: "Faculty of Applied Sciences", departments: [] },
    { name: "Faculty of Social Sciences & Languages", departments: [] },
    { name: "Faculty of Geomatics", departments: [] },
    { name: "Faculty of Technology", departments: [] },
    { name: "Faculty of Management Studies", departments: [] },
    { name: "Faculty of Medicine", departments: [] },
    { name: "Faculty of Agricultural Sciences", departments: [] },
  ];

  for (const item of faculties) {
    const [faculty] = await Faculty.findOrCreate({
      where: { name: item.name },
      defaults: { name: item.name },
    });

    for (const departmentName of item.departments) {
      await Department.findOrCreate({
        where: {
          name: departmentName,
          facultyId: faculty.getDataValue("id"),
        },
        defaults: {
          name: departmentName,
          facultyId: faculty.getDataValue("id"),
        },
      });
    }
  }

  console.log("Faculties seeded");
};

