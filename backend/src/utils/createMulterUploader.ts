import path from "path";
import fs from "node:fs";
import multer from "multer";
import ResponseError from "../error/response-error";

const createMulterUploader = (destinationFolder: string) => {
  const resolvedPath = path.resolve(__dirname, destinationFolder);

  if (!fs.existsSync(resolvedPath)) {
    fs.mkdirSync(resolvedPath, { recursive: true });
  }

  return multer({
    storage: multer.diskStorage({
      destination(req, file, callback) {
        callback(null, path.resolve(__dirname, destinationFolder));
      },
      filename(req, file, callback) {
        const uniqueSuffix =
          Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          path.extname(file.originalname);
        callback(null, uniqueSuffix);
      },
    }),
    fileFilter(req, file, callback) {
      const allowTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/avif",
      ];
      if (allowTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new ResponseError(415, "unsupported media type"));
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });
};

export default createMulterUploader;
