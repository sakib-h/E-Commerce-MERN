const multer = require("multer");
const { uploadDir } = require("../secret");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const extensionName = file.originalname.split(".").pop();
        cb(null, file.fieldname + "-" + Date.now() + "." + extensionName);
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
