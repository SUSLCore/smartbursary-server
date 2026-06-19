import fs from "fs";
import sequelize from "../config/database";

import Batch from "../models/batch.model";
import Department from "../models/department.model";
import EligibleStudent from "../models/eligibleStudent.model";
import EligibleListUpload from "../models/eligibleListUpload.model";

import { parseExcel } from "../utils/parseExcel";

const toPositiveInteger = (value: unknown) => {
  if (Array.isArray(value)) {
    value = value[0];
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0
    ? parsed
    : null;
};

interface UploadEligibleStudentsPayload {
  batchId: number | string;
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
    const {
      batchId,
      facultyId,
      departmentId,
      uploadedBy,
      filePath,
      fileName,
    } = payload;

    const normalizedFacultyId = toPositiveInteger(facultyId);
    const normalizedDepartmentId = toPositiveInteger(departmentId);
    const normalizedUploadedBy = toPositiveInteger(uploadedBy);

    if (!normalizedFacultyId) {
      throw new Error("facultyId must be a valid positive integer");
    }

    if (!normalizedDepartmentId) {
      throw new Error("departmentId must be a valid positive integer");
    }

    if (!normalizedUploadedBy) {
      throw new Error("uploadedBy must be a valid positive integer");
    }

    const transaction = await sequelize.transaction();

    try {
      const numericBatchId = toPositiveInteger(batchId);
      let batch = null;

      if (numericBatchId) {
        batch = await Batch.findByPk(numericBatchId);
      } else {
        batch = await Batch.findOne({
          where: {
            name: String(batchId).trim(),
          },
        });
      }

      if (!batch) {
        throw new Error(
          "Batch not found. Send a valid batchId or an existing batch name."
        );
      }

      // Validate Department
      const department = await Department.findByPk(
        normalizedDepartmentId
      );

      if (!department) {
        throw new Error("Department not found");
      }

      // Parse Excel
      const parsedStudents =
        parseExcel(filePath);

      console.log("[eligible-upload]", {
        filePath,
        parsedStudents: parsedStudents.length,
        batchRef: batchId,
      });

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
            batchId: batch.id,
            departmentId: normalizedDepartmentId,
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
            batchId: batch.id,
            departmentId: normalizedDepartmentId,
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
            batchId: batch.id,
            facultyId: normalizedFacultyId,
            departmentId: normalizedDepartmentId,
            uploadedBy: normalizedUploadedBy,
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

            facultyId: normalizedFacultyId,
            departmentId: normalizedDepartmentId,

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
        batchId: batch.id,
        departmentId: normalizedDepartmentId,
        totalStudents:
          parsedStudents.length,
      };
    } catch (error) {
      try {
        await transaction.rollback();
      } catch {
        // Ignore rollback failures; the original error is what we need to surface.
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
