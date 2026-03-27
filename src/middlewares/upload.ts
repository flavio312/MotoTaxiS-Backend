import multer from 'multer';

const storage = multer.memoryStorage();

const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (validMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen'), false);
    }
};


// Configuración de multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
    }
});

export default upload;