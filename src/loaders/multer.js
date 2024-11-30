const multer = require('multer');

module.exports = function(){
    const multerStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public');
        },
    
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}${Math.random()}.${file.mimetype.split('/')[1]}`);
        }
    });
    
    const multerFilter = (req, file, cb) => {
        // if (file.mimetype.split('/')[1] === 'pdf') {
        cb(null, true);
        // } else {
        //     cb(new Error('Not a pdf file'), false);
        // }
    }
    
    const upload = multer({
        storage: multerStorage,
        fileFilter: multerFilter
    });

    return upload;
}
