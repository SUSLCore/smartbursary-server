import fs from "fs";
import path from "path";

import { DocumentStep } from "../enums/DocumentStep";

export class FileStorage {
    /**
     * Root uploads directory
     */
    private static readonly UPLOAD_ROOT = path.join(process.cwd(), "uploads");

    /**
     * Monthly upload root
     */
    private static readonly MONTHLY_ROOT = path.join(
        FileStorage.UPLOAD_ROOT,
        "monthly"
    );

    /**
     * Ensure a directory exists
     */
    static ensureDirectoryExists(directory: string): void {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    /**
     * Returns:
     *
     * uploads/monthly/2026/06/
     */
    static getMonthlyDirectory(year: number, month: number): string {
        const monthString = month.toString().padStart(2, "0");

        const directory = path.join(
            FileStorage.MONTHLY_ROOT,
            year.toString(),
            monthString
        );

        this.ensureDirectoryExists(directory);

        return directory;
    }

    /**
     * Returns:
     *
     * uploads/monthly/2026/06/filename.xlsx
     */
    static buildMonthlyFilePath(
        year: number,
        month: number,
        batchId: number,
        departmentId: number,
        fileName: string
    ): string {
        const directory = path.join(
            this.getMonthlyDirectory(year, month),
            `batch_${batchId}`,
            `department_${departmentId}`
        );

        this.ensureDirectoryExists(directory);

        return path.join(directory, fileName);
    }

    /**
     * Relative path for database
     *
     * monthly/2026/06/original.xlsx
     */
    static buildRelativePath(
        year: number,
        month: number,
        batchId: number,
        departmentId: number,
        fileName: string
    ): string {
        return path.join(
            "monthly",
            year.toString(),
            month.toString().padStart(2, "0"),
            `batch_${batchId}`,
            `department_${departmentId}`,
            fileName
        );
    }

    /**
     * Convert DB path into absolute server path
     */
    static getAbsolutePath(relativePath: string): string {
        return path.join(
            FileStorage.UPLOAD_ROOT,
            relativePath
        );
    }

    /**
     * Delete file if exists
     */
    static deleteFile(relativePath: string): void {
        const absolutePath = this.getAbsolutePath(relativePath);

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }
    }

    /**
     * Delete an absolute file path
     */
    static deleteAbsoluteFile(filePath: string): void {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    /**
     * Check file exists
     */
    static fileExists(relativePath: string): boolean {
        return fs.existsSync(
            this.getAbsolutePath(relativePath)
        );
    }

    /**
     * File extension
     *
     * ".xlsx"
     */
    static getExtension(fileName: string): string {
        return path.extname(fileName);
    }

    /**
     * Filename for each workflow step
     */
    static getWorkflowFileName(
        step: DocumentStep,
        extension: string
    ): string {
        switch (step) {
            case DocumentStep.FACULTY_MA_UPLOAD:
                return `original${extension}`;

            case DocumentStep.SAR_APPROVAL:
                return `sar_signed${extension}`;

            case DocumentStep.FACULTY_ASR_APPROVAL:
                return `faculty_asr_signed${extension}`;

            case DocumentStep.DEPARTMENT_HEAD_APPROVAL:
                return `department_head_signed${extension}`;

            case DocumentStep.DEPARTMENT_MA_APPROVAL:
                return `department_ma_signed${extension}`;

            case DocumentStep.DEPARTMENT_HEAD_RETURN:
                return `department_head_return${extension}`;

            case DocumentStep.FACULTY_ASR_RETURN:
                return `faculty_asr_return${extension}`;

            case DocumentStep.SAR_RETURN:
                return `sar_return${extension}`;

            case DocumentStep.FACULTY_MA_FINAL:
                return `completed${extension}`;

            default:
                throw new Error("Invalid workflow step.");
        }
    }
}