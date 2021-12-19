import mongoose from 'mongoose';

const receiptsSchema = mongoose.Schema(
  {
    receiptNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    Mobile: {
      type: Number,
      trim: true,
    },
    receiptType: {
      type: String,
      required: true,
      trim: true,
    },
    collectionPoint: {
      type: String,
      required: true,
      trim: true,
    },
    Amount: {
      type: Number,
      trim: true,
    },
    Remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
receiptsSchema.index({ receiptNumber: 1, receiptType: 1 }, { unique: true });

const Receipt = mongoose.model('Receipt', receiptsSchema);

export default Receipt;
