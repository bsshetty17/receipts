import Receipt from '../models/receiptsModel.js';
import asyncHandler from 'express-async-handler';

const calculateTotals = (data) => {
  const returnObj = {};
  for (let i = 0; i < data.length; i++) {
    const type = data[i].receiptType;
    const point = data[i].collectionPoint;
    const amt = data[i].Amount;
    if (returnObj[type] !== undefined) {
      if (returnObj[type][point] !== undefined) {
        returnObj[type][point] += amt;
      } else {
        returnObj[type][point] = amt;
      }
    } else {
      returnObj[type] = {};
      returnObj[type][point] = amt;
    }
  }
  return returnObj;
};
const identifyMissingReceipts = (data) => {
  const returnObj = {};
  for (let i = 0; i < data.length; i++) {
    const type = data[i].receiptType;
    const number = data[i].receiptNumber;
    if (returnObj[type] !== undefined) {
      returnObj[type].push(number);
    } else {
      returnObj[type] = [number];
    }
  }

  for (const [key, values] of Object.entries(returnObj)) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const missingList = [];
    if (min !== max) {
      for (let i = min + 1; i < max; i++) {
        if (!values.includes(i)) {
          missingList.push(i);
        }
      }
    }
    if (missingList.length > 0) {
      returnObj[key] = missingList;
    } else {
      delete returnObj[key];
    }
  }

  return returnObj;
};

//getUsers function to get all users
export const getReceipts = asyncHandler(async (req, res) => {
  const receipts = await Receipt.find({});
  res.json(receipts);
});

export const getMissingReceipts = asyncHandler(async (req, res) => {
  const receipts = await Receipt.find({}).select({
    receiptNumber: 1,
    receiptType: 1,
  });
  if (receipts) {
    const resposeData = identifyMissingReceipts(receipts);
    res.json(resposeData);
  } else {
    res.status(404).json({ message: 'Receipts not found' });
    res.status(404);
    throw new Error('Receipts not found');
  }
});

export const getTotals = asyncHandler(async (req, res) => {
  const receipts = await Receipt.find({}).select({
    receiptNumber: 1,
    receiptType: 1,
    collectionPoint: 1,
    Amount: 1,
  });
  if (receipts) {
    const resposeData = calculateTotals(receipts);
    res.json(resposeData);
  } else {
    res.status(404).json({ message: 'Receipts not found' });
    res.status(404);
    throw new Error('Receipts not found');
  }
});

// save receipts
export const saveReceipt = asyncHandler(async (req, res) => {
  const receipt = new Receipt(req.body);

  await receipt.save((err, data) => {
    if (err) {
      if (err.code && err.code == 11000) {
        res.status(400).send('Receipt number for this type already exists');
      } else {
        console.log(err);
        res.status(400).send('Unknown error');
      }
    } else {
      res.send('Data inserted');
    }
  });
});

export const updateReceipt = asyncHandler(async (req, res) => {
  await Receipt.updateOne({ _id: req.body._id }, req.body, (err, data) => {
    if (err) {
      if (err.code && err.code == 11000) {
        res.status(400).send('Receipt number for this type already exists');
      } else {
        console.log(err);
        res.status(400).send('Unknown error');
      }
    } else {
      res.send(data);
    }
  });
});

export const deleteReceipt = asyncHandler(async (req, res) => {
  await Receipt.deleteOne({ _id: req.body._id })
    .then((status) => {
      res.send(status);
    })
    .catch((err) => {
      res.send(err);
    });
});

//getUserById function to retrieve user by id
export const getReceiptById = asyncHandler(async (req, res) => {
  const receipt = await Receipt.findById(req.params.id);

  //if user id match param id send user else throw error
  if (receipt) {
    res.json(receipt);
  } else {
    res.status(404).json({ message: 'Receipt not found' });
    res.status(404);
    throw new Error('Receipt not found');
  }
});
