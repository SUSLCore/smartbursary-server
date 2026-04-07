import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { UserRole } from "../types/user.types";

const adminSeeder = async () => {
  const existingAdmin = await User.findOne({
    where: { email: process.env.ADMIN_EMAIL },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD as string,
      10
    );

    await User.create({
      registerId: "ADMIN001",
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    console.log("Admin account created");
  } else {
    console.log("Admin already exists");
  }
};

export default adminSeeder;