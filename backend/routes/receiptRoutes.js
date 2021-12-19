import {
  getReceipts,
  getReceiptById,
  saveReceipt,
  deleteReceipt,
  updateReceipt,
  getMissingReceipts,
  getTotals,
} from '../controllers/receiptController.js';
import express from 'express';
const router = express.Router();

// express router method to create route for getting all users
router.route('/').get(getReceipts);
router.route('/missing').get(getMissingReceipts);
router.route('/totals').get(getTotals);
router.route('/add').post(saveReceipt);
router.route('/update').put(updateReceipt);
router.route('/delete').delete(deleteReceipt);
router.route('/:id').get(getReceiptById);

export default router;
