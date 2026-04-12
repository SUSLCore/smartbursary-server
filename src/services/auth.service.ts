import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import { UserRole } from "../types/user.types";

export const registerStudentService = async (data: any) => {
  const existingUser = await User.findOne({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const student = await User.create({
    registerId: data.registerId,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: UserRole.STUDENT,
    FacultyId: data.facultyId,
    DepartmentId: data.departmentId,
    phone: data.phone,
  });

   const safeStudent = {
    id: student.getDataValue("id"),
    registerId: student.getDataValue("registerId"),
    name: student.getDataValue("name"),
    email: student.getDataValue("email"),
    role: student.getDataValue("role"),
    phone: student.getDataValue("phone"),
    FacultyId: student.getDataValue("FacultyId"),
    DepartmentId: student.getDataValue("DepartmentId"),
  };


  return safeStudent;
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.getDataValue("password"));

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(
    user.getDataValue("id"),
    user.getDataValue("role")
  );

  const safeUser = {
    id: user.getDataValue("id"),
    registerId: user.getDataValue("registerId"),
    name: user.getDataValue("name"),
    email: user.getDataValue("email"),
    role: user.getDataValue("role"),
    phone: user.getDataValue("phone"),
    FacultyId: user.getDataValue("FacultyId"),
    DepartmentId: user.getDataValue("DepartmentId"),
  };

  return { user: safeUser, token };
};