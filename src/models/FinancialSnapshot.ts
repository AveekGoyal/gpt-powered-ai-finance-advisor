// File: src/models/FinancialSnapshot.ts

import mongoose from 'mongoose';

interface IFinancialSnapshot extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  income: number;
  expenses: Map<string, number>;
  savings: number;
  investments: Map<string, number>;
  createdAt: Date;
}

const financialSnapshotSchema = new mongoose.Schema<IFinancialSnapshot>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  expenses: {
    type: Map,
    of: Number,
    required: true
  },
  savings: {
    type: Number,
    required: true
  },
  investments: {
    type: Map,
    of: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.FinancialSnapshot || mongoose.model<IFinancialSnapshot>('FinancialSnapshot', financialSnapshotSchema);