    import multer from "multer";
    import path from "path";
    import { Request } from "express";

    const storage = multer.memoryStorage();

    /**
     * Allowed file extensions
     */
    const allowedExtensions = [
    ".xlsx",
    ".xls",
    ".xlsm",
    ".pdf",
    ];

    /**
     * Allowed MIME types
     */
    const allowedMimeTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "application/vnd.ms-excel.sheet.macroEnabled.12", // .xlsm
    "application/pdf",
    ];

    const fileFilter: multer.Options["fileFilter"] = (
    req: Request,
    file,
    callback
    ) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const validExtension = allowedExtensions.includes(extension);

    const validMime = allowedMimeTypes.includes(file.mimetype);

    if (!validExtension || !validMime) {
        return callback(
        new Error(
            "Invalid file type. Only Excel (.xlsx, .xls, .xlsm) and PDF files are allowed."
        )
        );
    }

    callback(null, true);
    };

    export const monthlyDocumentUpload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB
        files: 1,
    },
    });