import Faculty from "../models/faculty.model";

const faculties = [
  { name: "Faculty of Agricultural Sciences", code: "FAS" },
  { name: "Faculty of Applied Sciences", code: "FAPS" },
  { name: "Faculty of Geomatics", code: "FG" },
  { name: "Faculty of Management Studies", code: "FMS" },
  { name: "Faculty of Social Sciences & Languages", code: "FSSL" },
  { name: "Faculty of Medicine", code: "FM" },
  { name: "Faculty of Technology", code: "FT" },
  { name: "Faculty of Computing", code: "FC" },
];

const facultySeeder = async () => {
  for (const faculty of faculties) {
    const exists = await Faculty.findOne({
      where: { code: faculty.code },
    });

    if (!exists) {
      await Faculty.create(faculty);
    }
  }

  console.log("✅ Faculties seeded");
};

export default facultySeeder;