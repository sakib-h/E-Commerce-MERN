const multer = require("multer");
const { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require("../config");

const userStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(
            new Error("Unsupported image format. Only image files are allowed"),
            false
        );
    }
    if (file.size > MAX_FILE_SIZE) {
        return cb(new Error("File size should be less than 2MB"), false);
    }
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return cb(new Error("Unsupported image format"), false);
    }
    cb(null, true);
};

const uploadUserImage = multer({
    storage: userStorage,
    fileFilter: fileFilter,
});

module.exports = uploadUserImage;
