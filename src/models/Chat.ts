// File: src/models/Chat.ts

import mongoose from 'mongoose';

interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface IChat extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  messages: IMessage[];
}

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

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema);