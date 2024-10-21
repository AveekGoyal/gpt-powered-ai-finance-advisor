import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  annualIncome: number;
  monthlyExpenses: Map<string, number>;
  currentSavings: number;
  financialGoals: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  onboardingCompleted: boolean;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  annualIncome: {
    type: Number,
    default: 0,
  },
  monthlyExpenses: {
    type: Map,
    of: Number,
    default: {},
  },
  currentSavings: {
    type: Number,
    default: 0,
  },
  financialGoals: [{
    type: String,
    enum: ['retirement', 'homePurchase', 'debtPayoff', 'investment', 'other'],
  }],
  riskTolerance: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);