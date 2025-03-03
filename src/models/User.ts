import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the interface for a user
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

// Define the user schema
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

// Middleware to hash the password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Method to compare password with hashed password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);