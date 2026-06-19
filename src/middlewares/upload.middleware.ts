import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/");
  },

  filename: (_, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.originalname}`
    );
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  const allowed = [
    ".xlsx",
    ".xls",
  ];

  const ext = path.extname(
    file.originalname
  );

  if (allowed.includes(ext)) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Only Excel files are allowed"
    )
  );
};

export const upload = multer({
  storage,
  fileFilter,
});