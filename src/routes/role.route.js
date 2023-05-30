import express from 'express';
import roleController from '../controllers/role.controller'
const router = express.Router();


router.post('/create', roleController.createRole)
router.post('/update-role/:id', roleController.updateRole)
router.get('/role-detail/:id', roleController.roleUser)
router.get('/role-edit/:id', roleController.displayRoleEdit)
router.get('/role-delete/:id', roleController.deleteRole)
router.post('/role-edit/:id', roleController.roleEdit)
router.get('/role-create', roleController.displayCreateRole)
router.get('/', roleController.displayRole)

export default router;