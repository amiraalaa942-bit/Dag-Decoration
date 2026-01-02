// import express from "express";
// import cors from 'cors';
// import { config } from 'dotenv';
// import fileUpload from 'express-fileupload';
// import paintingRoutes from './routes/paintings.js';
// import userRoutes from './routes/users.js';
// import cartRoutes from './routes/cart.js';
// import orderRoutes from './routes/orders.js';
// import dotenv from 'dotenv';
// dotenv.config();

// config({ path: '.env' });

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());
// app.use(fileUpload());

// app.use('/', paintingRoutes);
// app.use('/', userRoutes);
// app.use('/', cartRoutes);
// app.use('/', orderRoutes);

// app.listen(port, () => {
//   console.log(`Server is listening on Port ${port}`);
// });

// export default app;

import express from "express";
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import paintingRoutes from './routes/paintings.js';
import userRoutes from './routes/users.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import dotenv from 'dotenv';

// Determine environment
const nodeEnv = process.env.NODE_ENV || 'development';
console.log(`Starting server in ${nodeEnv} mode`);

// Load the appropriate .env file
const envFile = nodeEnv === 'production' 
  ? '.env.production' 
  : nodeEnv === 'test' 
    ? '.env.test' 
    : '.env';

// Try to load the specific env file
const envResult = dotenv.config({ 
  path: path.resolve(process.cwd(), envFile) 
});

if (envResult.error) {
  console.warn(`Could not load ${envFile}: ${envResult.error.message}`);
  
  // Fallback to default .env if specific file not found
  dotenv.config();
  console.log('Falling back to default .env file');
} else {
  console.log(`Loaded environment from ${envFile}`);
}

const app = express();
const port = process.env.PORT || 8080;

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:4200',
      'http://localhost:3000',
      // Add your production frontend URL here
      ...(nodeEnv === 'production' ? [
        'https://your-production-domain.com'
      ] : [])
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// File upload configuration
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  useTempFiles: nodeEnv === 'production', // Use temp files in production
  tempFileDir: '/tmp/',
  createParentPath: true,
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true,
  limitHandler: (req, res, next) => {
    res.status(413).json({ error: 'File size too large. Maximum 10MB allowed.' });
  }
}));

// Routes
app.use('/', paintingRoutes);
app.use('/', userRoutes);
app.use('/', cartRoutes);
app.use('/', orderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: nodeEnv,
    timestamp: new Date().toISOString(),
    jwtConfigured: !!process.env.JWT_SecretKey,
    port: port
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', {
    error: err.message,
    stack: nodeEnv === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    environment: nodeEnv
  });
  
  res.status(500).json({
    error: nodeEnv === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

app.listen(port, () => {
  console.log(`====================================`);
  console.log(`Server is listening on Port ${port}`);
  console.log(`Environment: ${nodeEnv}`);
  console.log(`JWT Secret configured: ${!!process.env.JWT_SecretKey}`);
  console.log(`====================================`);
});

export default app;