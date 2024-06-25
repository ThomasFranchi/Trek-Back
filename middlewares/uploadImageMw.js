const multer = require("multer")

module.exports = function (fieldImage) 
{
    return multer({
        storage: multer.diskStorage({
            // Setup upload destination directory
            destination: (req, file, cb) => {
                cb(null, "./uploads");
            },

            // format file name
            filename: (req, file, cb) => {
                const uniqueSuffix = fieldImage + Date.now() + '-' + file.originalname;
                cb(null, uniqueSuffix/* + file.originalname*/);
            },
            
            // File type filter
            fileFilter: (req, file, cb) => {
            const allowedMimeTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg"
            ];

            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(null, false);
            }
            cb (null, true);
        },
        limits: {
            fileSize: 1024 * 1024 * 10,
        },
    }),
    }).single(fieldImage);
};