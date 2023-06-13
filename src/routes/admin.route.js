import express from 'express';
import watchController from '../controllers/watch.controller';
import brandController from '../controllers/brand.controller';
import warehouseController from '../controllers/warehouse.controller';
import roleController from '../controllers/role.controller';
import {verifyAdmin} from '../middleware/auth';
import {verifyAddProduct} from '../middleware/role'
import {verifyUpdateProduct} from '../middleware/role'
import upload from '../utils/multer';

const router = express.Router();

router.get('/', (req, res) => res.render('admin/home', {layout: 'admin'}));

// watch route
router.get('/watch', watchController.getProductManager);
router.post('/watch/add',verifyAddProduct, upload.single('image'), watchController.create)
router.post('/watch/update/:id',verifyUpdateProduct, upload.single('image'), watchController.update)
router.post('/watch/delete/:id', watchController.delete)

// brand route
router.get('/brand', brandController.getAllBrands)
router.post('/brand/add', upload.single('image'), brandController.create)
router.post('/brand/update/:id', upload.single('image'), brandController.update)
router.post('/brand/delete/:id', brandController.delete)

// warehouse route
router.get('/warehouse', warehouseController.getHomePage);
router.post('/warehouse/add', warehouseController.createAddReceipt);
// role route
router.post('/role/create', verifyAdmin, roleController.createRole)
router.post('/role/update-role/:id', verifyAdmin, roleController.updateRole)
router.get('/role/role-detail/:id', verifyAdmin, roleController.roleUser)
router.get('/role/role-edit/:id', verifyAdmin, roleController.displayRoleEdit)
router.get('/role/role-delete/:id', verifyAdmin, roleController.deleteRole)
router.post('/role/role-edit/:id', verifyAdmin, roleController.roleEdit)
router.get('/role/role-create', verifyAdmin, roleController.displayCreateRole)
router.get('/role', verifyAdmin, roleController.displayRole)

export default router;
