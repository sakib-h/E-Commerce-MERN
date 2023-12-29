const multer = require("multer");
const {
    UPLOAD_USER_IMG_DIR,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES,
} = require("../config");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_USER_IMG_DIR);
    },
    filename: (req, file, cb) => {
        const extensionName = file.originalname.split(".").pop();
        cb(null, file.fieldname + "-" + Date.now() + "." + extensionName);
    },
});

const fileFilter = (req, file, cb) => {
    const extensionName = file.originalname.split(".").pop();
    if (!ALLOWED_FILE_TYPES.includes(extensionName)) {
        return cb(
            new Error(`Only ${ALLOWED_FILE_TYPES.join(", ")} files allowed!`),
            false
        );
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
});

module.exports = upload;
