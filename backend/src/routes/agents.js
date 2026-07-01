const router  = require('express').Router();
const multer  = require('multer');
const ctrl    = require('../controllers/agentController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

router.get('/',    ctrl.list);
router.post('/',   ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

router.get('/:id/files',               ctrl.listFiles);
router.post('/:id/files', upload.single('file'), ctrl.uploadFile);
router.delete('/:id/files/:fileId',    ctrl.deleteFile);

module.exports = router;
