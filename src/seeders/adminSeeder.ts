import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { UserRole } from "../types/user.types";

const adminSeeder = async () => {
  const existingAdmin = await User.findOne({
    where: { email: process.env.ADMIN_EMAIL },
  });
  const adminName = process.env.ADMIN_NAME;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminName || !adminEmail || !adminPassword) {
  throw new Error("Missing admin environment variables in .env file");
}

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD as string,
      10
    );

await User.create({
  registerId: "ADMIN001",
  name: adminName,
  email: adminEmail,
  password: hashedPassword,
  role: UserRole.ADMIN,
  isActive: true,
  mustChangePassword: false,
});

console.log("Admin account created");
  } else {
    console.log("Admin already exists");
  }
};

export default adminSeeder;