import mongoose from 'mongoose';

// Define the interface for a financial goal
interface IGoal extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  type: 'retirement' | 'homePurchase' | 'education' | 'other';
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  progress: number;
  strategy: string;
}

// Define the goal schema
const goalSchema = new mongoose.Schema<IGoal>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['retirement', 'homePurchase', 'education', 'other'],
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  targetDate: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  strategy: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Export the Goal model
export default mongoose.models.Goal || mongoose.model<IGoal>('Goal', goalSchema);