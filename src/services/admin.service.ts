import User from "../models/user.model";

export class AdminService {

  static async getUserByRegisterId(registerId: string) {
    const user = await User.findOne({
      where: { registerId },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }


  static async deleteUserByRegisterId(registerId: string) {
    const user = await User.findOne({
      where: { registerId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await user.destroy();

    return {
      message: "User deleted successfully",
      registerId,
    };
  }
}