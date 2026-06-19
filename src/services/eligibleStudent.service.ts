import fs from "fs";
import sequelize from "../config/database";

import Batch from "../models/batch.model";
import Department from "../models/department.model";
import EligibleStudent from "../models/eligibleStudent.model";
import EligibleListUpload from "../models/eligibleListUpload.model";

import { parseExcel } from "../utils/parseExcel";

interface UploadEligibleStudentsPayload {
  batchId: number;
  facultyId: number;
  departmentId: number;
  uploadedBy: number;
  filePath: string;
  fileName: string;
}

class EligibleStudentService {
  async uploadEligibleStudents(
    payload: UploadEligibleStudentsPayload
  ) {
    const transaction = await sequelize.transaction();

    try {
      const {
        batchId,
        facultyId,
        departmentId,
        uploadedBy,
        filePath,
        fileName,
      } = payload;

      // Validate Batch
      const batch = await Batch.findByPk(batchId);

      if (!batch) {
        throw new Error("Batch not found");
      }

      // Validate Department
      const department = await Department.findByPk(
        departmentId
      );

      if (!department) {
        throw new Error("Department not found");
      }

      // Parse Excel
      const parsedStudents =
        parseExcel(filePath);

      if (!parsedStudents.length) {
        throw new Error(
          "No students found in uploaded file"
        );
      }

      /*
       * STEP 1
       * Find previous uploads for same batch + department
       */
      const previousUploads =
        await EligibleListUpload.findAll({
          where: {
            batchId,
            departmentId,
          },
          transaction,
        });

      const uploadIds =
        previousUploads.map(
          (upload: any) => upload.id
        );

      /*
       * STEP 2
       * Delete previous students
       */
      if (uploadIds.length > 0) {
        await EligibleStudent.destroy({
          where: {
            uploadId: uploadIds,
          },
          transaction,
        });

        await EligibleListUpload.destroy({
          where: {
            batchId,
            departmentId,
          },
          transaction,
        });
      }

      /*
       * STEP 3
       * Create new upload record
       */
      const upload =
        await EligibleListUpload.create(
          {
            batchId,
            facultyId,
            departmentId,
            uploadedBy,
            fileName,
            totalStudents:
              parsedStudents.length,
          },
          { transaction }
        );

      /*
       * STEP 4
       * Prepare students
       */
      const studentsToInsert =
        parsedStudents.map(
          (student: any) => ({
            uploadId: upload.id,

            facultyId,
            departmentId,

            registerId:
              student.registerId,

            studentName:
              student.name,

            batchYear:
              student.batchYear || null,

            semester:
              student.semester || null,

            accountNumber:
              student.accountNumber ||
              null,

            branchCode:
              student.branchCode || null,

            amount:
              student.amount || 0,

            recommendation:
              true,

            isEligible: true,
          })
        );

      /*
       * STEP 5
       * Bulk insert
       */
      await EligibleStudent.bulkCreate(
        studentsToInsert,
        {
          transaction,
        }
      );

      await transaction.commit();

      // Remove temp uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        success: true,
        message:
          "Eligible student list uploaded successfully",
        batchId,
        departmentId,
        totalStudents:
          parsedStudents.length,
      };
    } catch (error) {
      await transaction.rollback();

      if (
        payload.filePath &&
        fs.existsSync(payload.filePath)
      ) {
        fs.unlinkSync(payload.filePath);
      }

      throw error;
    }
  }

  async getDepartmentStudents(
    departmentId: number
  ) {
    return await EligibleStudent.findAll({
      where: {
        departmentId,
        isEligible: true,
      },
      order: [["studentName", "ASC"]],
    });
  }

  async getStudentByRegisterId(
    registerId: string
  ) {
    return await EligibleStudent.findOne({
      where: {
        registerId,
        isEligible: true,
      },
    });
  }

  async removeStudent(id: number) {
    const student =
      await EligibleStudent.findByPk(id);

    if (!student) {
      throw new Error(
        "Student not found"
      );
    }

    await student.update({
      isEligible: false,
    });

    return {
      success: true,
      message:
        "Student removed successfully",
    };
  }

  async checkEligibility(
    registerId: string
  ) {
    const student =
      await EligibleStudent.findOne({
        where: {
          registerId,
          isEligible: true,
        },
      });

    return {
      eligible: !!student,
      student,
    };
  }
}

export default new EligibleStudentService();