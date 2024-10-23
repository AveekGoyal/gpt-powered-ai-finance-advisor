import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

type CachedMongoose = {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
};

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  } | undefined;
}

let cached: CachedMongoose = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,    
      socketTimeoutMS: 5000,             
      maxPoolSize: 10,                  
      minPoolSize: 5,                    
      maxIdleTimeMS: 10000,             
      connectTimeoutMS: 5000,           
      retryWrites: true,               
      w: "majority",                    
    };

    console.log('Connecting to MongoDB...'); 
    
    // Add timeout for the connection promise
    const connectionPromise = mongoose.connect(MONGODB_URI, opts);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('MongoDB connection timeout'));
      }, 5000);
    });

    cached.promise = Promise.race([connectionPromise, timeoutPromise])
      .then((mongoose: any) => {
        console.log('MongoDB connected successfully'); // Added: Debug log
        return mongoose.connection;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err); // Added: Debug log
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Error establishing MongoDB connection:', e); // Added: Debug log
    throw e;
  }

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected'); // Added: Debug log
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err); // Added: Debug log
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected'); // Added: Debug log
  });

  return cached.conn;
}

// Added: Clean up function for graceful shutdown
export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  } catch (err) {
    console.error('Error disconnecting from MongoDB:', err);
    throw err;
  }
}

// Handle process termination
if (process.env.NODE_ENV !== 'production') {
  process.on('SIGINT', async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}