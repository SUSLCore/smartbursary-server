import User from "../models/user.model";
import Faculty from "../models/faculty.model";
import Department from "../models/department.model";
import EligibleStudent from "../models/eligibleStudent.model";
import Batch from "../models/batch.model";

class UserService {
  async getProfile(userId: number) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Faculty,
        },
        {
          model: Department,
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const eligibilityRecords =
      await EligibleStudent.findAll({
        where: {
          registerId: user.registerId,
          isEligible: true,
        },
        include: [
          {
            model: Batch,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

    return {
      ...user.toJSON(),

      isEligible:
        eligibilityRecords.length > 0,

      eligibilityRecords:
        eligibilityRecords.map(
          (record: any) => ({
            id: record.id,

            batchId: record.batchId,

            batchName:
              record.Batch?.name,

            amount: record.amount,

            accountNumber:
              record.accountNumber,

            branchCode:
              record.branchCode,

            recommendation:
              record.recommendation,

            batchYear:
              record.batchYear,

            semester:
              record.semester,
          })
        ),
    };
  }
}

export default new UserService();