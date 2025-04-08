const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'juventud-conecta-users-profile',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    },
});

const upload = multer({ storage })

module.exports = upload;