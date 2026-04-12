import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import { UserRole } from "../types/user.types";

const sanitizeUser = (user: any) => {
  const safeUser = user.toJSON ? user.toJSON() : { ...user };
  delete safeUser.password;
  return safeUser;
};

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

  return sanitizeUser(student);
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({
    where: { email },
    attributes: { include: ["password"] },
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

  const safeUser = sanitizeUser(user);

  return { user: safeUser, token };
};