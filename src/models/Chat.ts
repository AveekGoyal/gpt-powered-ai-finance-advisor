import mongoose from 'mongoose';

// Define the interface for a single message
interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the interface for the chat schema
interface IChat extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  messages: IMessage[];
}

// Define the chat schema
const chatSchema = new mongoose.Schema<IChat>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

// Export the Chat model
export default mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema);