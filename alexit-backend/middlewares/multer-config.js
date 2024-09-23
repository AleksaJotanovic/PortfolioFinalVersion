import multer from "multer";



const categoryStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/categories'),
    filename: (req, file, cb) => {
        let unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, unique + '.' + file.mimetype.split('/')[1]);
    }
});
export const categoryUpload = multer({ storage: categoryStorage });



const productStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/products'),
    filename: (req, file, cb) => {
        let unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, unique + '.' + file.mimetype.split('/')[1]);
    }
});
export const productUpload = multer({ storage: productStorage });



const blogsFeaturedStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/blogs/featured'),
    filename: (req, file, cb) => {
        let unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, unique + '.' + file.mimetype.split('/')[1]);
    }
});
export const blogsFeaturedUpload = multer({ storage: blogsFeaturedStorage });



const blogsGalleriesStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/blogs/galleries'),
    filename: (req, file, cb) => {
        let unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, unique + '.' + file.mimetype.split('/')[1]);
    }
})
export const blogsGalleriesUpload = multer({ storage: blogsGalleriesStorage });



const blogsSinglesStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/blogs/singles'),
    filename: (req, file, cb) => {
        let unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, unique + '.' + file.mimetype.split('/')[1]);
    }
});
export const blogsSinglesUpload = multer({ storage: blogsSinglesStorage });



const offersFeaturedStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/offersFeaturedImages'),
    filename: (req, file, cb) => {
        let unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, unique + '.' + file.mimetype.split('/')[1]);
    }
});
export const offersFeaturedUpload = multer({ storage: offersFeaturedStorage });