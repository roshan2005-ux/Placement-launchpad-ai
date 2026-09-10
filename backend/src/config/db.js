import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('<username>') && !uri.includes('xxxxx')) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });

      const host = conn.connection.host || 'MongoDB Atlas';
      const dbName = conn.connection.name || 'placement_db';
      console.log(`[Database] MongoDB Atlas Connected successfully: host=${host}, database=${dbName}`);
      return true;
    } catch (error) {
      console.error(`[Database] MongoDB Atlas Connection error: ${error.message}`);
      console.log('[Database] Operating with resilient development storage fallback.');
      return false;
    }
  }

  console.log('[Database] MONGODB_URI pending in backend/.env. Running with active in-memory development database for local testing.');
  return false;
};
