import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/greencart';
    
    const options = {
      retryWrites: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      // Disable DNS SRV lookup
      srvServiceName: '',
    };

    // For +srv URIs, we need to handle SRV differently
    let uri = mongoURI;
    
    // Retry with backoff
    let retries = 3;
    while (retries > 0) {
      try {
        await mongoose.connect(uri, options);
        console.log('MongoDB connected successfully');
        return;
      } catch (error) {
        retries--;
        if (retries > 0) {
          console.log(`Connection failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit, allow API to still work
    console.warn('Warning: Database connection failed. API running without database.');
  }
};


