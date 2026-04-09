import Department from "../models/department.model";
import Faculty from "../models/faculty.model";

const departmentSeeder = async () => {
  const facultyMap: any = {};

  const faculties = await Faculty.findAll();

  faculties.forEach((faculty: any) => {
    facultyMap[faculty.name] = faculty.id;
  });

  const departments = [
    // Agricultural Sciences
    { name: "Agribusiness Management", faculty: "Faculty of Agricultural Sciences" },
    { name: "Export Agriculture", faculty: "Faculty of Agricultural Sciences" },
    { name: "Livestock Production", faculty: "Faculty of Agricultural Sciences" },

    // Applied Sciences
    { name: "Food Science & Technology", faculty: "Faculty of Applied Sciences" },
    { name: "Natural Resources", faculty: "Faculty of Applied Sciences" },
    { name: "Physical Sciences & Technology", faculty: "Faculty of Applied Sciences" },
    { name: "Computing & Information Systems", faculty: "Faculty of Applied Sciences" },
    { name: "Sports Sciences & Physical Education", faculty: "Faculty of Applied Sciences" },

    // Geomatics
    { name: "CPRSG", faculty: "Faculty of Geomatics" },
    { name: "Surveying and Geodesy", faculty: "Faculty of Geomatics" },

    // Management
    { name: "Accountancy and Finance", faculty: "Faculty of Management Studies" },
    { name: "Business Management", faculty: "Faculty of Management Studies" },
    { name: "Marketing Management", faculty: "Faculty of Management Studies" },
    { name: "Tourism Management", faculty: "Faculty of Management Studies" },

    // Social Sciences
    { name: "Economics and Statistics", faculty: "Faculty of Social Sciences & Languages" },
    { name: "English Language Teaching", faculty: "Faculty of Social Sciences & Languages" },
    { name: "Languages", faculty: "Faculty of Social Sciences & Languages" },
    { name: "Social Sciences", faculty: "Faculty of Social Sciences & Languages" },

    // Technology
    { name: "Biosystems Technology", faculty: "Faculty of Technology" },
    { name: "Engineering Technology", faculty: "Faculty of Technology" },

    // Computing
    { name: "Department of Computing & Information Systems", faculty: "Faculty of Computing" },
    { name: "Department of Software Engineering", faculty: "Faculty of Computing" },
    { name: "Department of Data Science", faculty: "Faculty of Computing" },
  ];

  for (const dept of departments) {
    const exists = await Department.findOne({
      where: { name: dept.name },
    });

    if (!exists) {
      await Department.create({
        name: dept.name,
        FacultyId: facultyMap[dept.faculty],
      });
    }
  }

  console.log("✅ Departments seeded");
};

export default departmentSeeder;