import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import multer from 'multer';
import { ErrorException } from '../middleware/error-handler/errException';
import { AuthRequest } from '../middleware/auth';

const STATIC_FOLDER = '../meepley_cdn';

const whitelistFilesExt = ['image/png', 'image/jpeg', 'image/jpg'];

const imageFileStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, `${STATIC_FOLDER}/avatars`);
  },
  filename: function (req, file, callback) {
    const uniqueId = uuidv4();
    const ext = mime.extension(file.mimetype);

    callback(null, `${uniqueId}-${file.fieldname}.${ext}`);
  },
});

export const uploadSingleFile = multer({
  storage: imageFileStorage,
  fileFilter(req: AuthRequest, file, callback) {
    // check user quota
    if (req.userQuota >= 100000000) {
      // more than 100mb per user
      return callback(new ErrorException('User excedded max quota usage'));
    }

    //* check if file is valid
    if (!whitelistFilesExt.includes(file.mimetype)) {
      return callback(new ErrorException('File type is not allowed'));
    }

    return callback(null, true);
  },
  limits: { fileSize: 1048576 },
}).single('file');
