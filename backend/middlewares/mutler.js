import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");
export const singleUpload1 = multer({ storage }).single("profilePhoto");