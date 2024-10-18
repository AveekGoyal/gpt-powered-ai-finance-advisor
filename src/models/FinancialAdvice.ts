// File: src/models/FinancialAdvice.ts

import mongoose from 'mongoose';

interface IFinancialAdvice extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  question: string;
  area: 'general' | 'budgeting' | 'investing' | 'debt' | 'savings';
  advice: string;
  createdAt: Date;
}

const financialAdviceSchema = new mongoose.Schema<IFinancialAdvice>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  area: {
    type: String,
    enum: ['general', 'budgeting', 'investing', 'debt', 'savings'],
    default: 'general'
  },
  advice: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.FinancialAdvice || mongoose.model<IFinancialAdvice>('FinancialAdvice', financialAdviceSchema);