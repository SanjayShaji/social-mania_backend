import multer, { diskStorage } from 'multer'
import {v4} from 'uuid'
// import {v2 as cloudinary} from 'cloudinary'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const uuid = v4();
const storage = diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/post-images')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '_' + uuid + file.originalname)
    }
})

const storage1 = diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/profile-images')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '_' + uuid + file.originalname)
    }
})

const storage2 = diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/cover-images')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '_' + uuid + file.originalname)
    }
})


export const postUpload = multer({storage: storage});
export const profileUpload = multer({storage: storage1});
export const coverUpload = multer({storage: storage2});
