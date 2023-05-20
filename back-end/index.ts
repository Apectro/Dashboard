import express from 'express';
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import authRoutes from './routes/auth';
import dataRoutes from './routes/data';
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://marijo:Nikolina06@cluster0.o7deldw.mongodb.net/?retryWrites=true&w=majority';

// Declare io in the module scope
let io: IOServer | undefined;

mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    // Create a new HTTP server and wrap the Express app
    const httpServer = new HttpServer(app);

    // Initialize io inside the callback
    io = new IOServer(httpServer, {
      cors: {
        origin: '*', // This allows all origins. Adjust this according to your needs.
        methods: ['GET', 'POST'],
      },
    });

    // Make io accessible to our router files
    app.use(function (req, res, next) {
      if (io) {
        req.io = io;
      }
      next();
    });

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

export { io };
