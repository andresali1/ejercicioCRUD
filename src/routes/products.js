// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { body } = require('express-validator');

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

//************* Multer *******************
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../../public/images/products'))
    },
    filename: (req, file, cb) => {
        const fileName = file.fieldname + Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    }
});

const upload = multer({ storage });

const validations = [
    body('name').notEmpty().withMessage('Tenés que escribir un nombre'),
    body('price')
    .notEmpty().withMessage('No olvidés darle un precio al producto').bail()
    .isInt().withMessage('Digitá el precio en números'),
    body('discount')
    .notEmpty().withMessage('Aclaranos el descuento que tendrá tu producto, si no, poné 0').bail()
    .isInt().withMessage('Digitá el descuento en números'),
    body('category').notEmpty().withMessage('Eligé una categoría'),
    body('description').notEmpty().withMessage('Permitenos conocer un poco más de tu producto'),
];

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.index); 

/*** CREATE ONE PRODUCT ***/ 
router.get('/create', productsController.create); 
router.post('/', upload.single('product-image'), validations, productsController.store); 


/*** GET ONE PRODUCT ***/ 
router.get('/:id', productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/:id/edit', productsController.edit); 
router.put('/:id',upload.single('product-image'), productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete('/:id', productsController.destroy); 


module.exports = router;