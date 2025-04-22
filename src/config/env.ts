import dotenv from 'dotenv';
import { ApiError } from '../types';

// Initialize environment variables
dotenv.config();

// Environment constants
export const PORT = process.env.PORT || 3000;

// Validate and format private key
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  const error: ApiError = new Error('Private key not found in .env');
  error.statusCode = 500;
  throw error;
}

export const FORMATTED_PRIVATE_KEY = PRIVATE_KEY.startsWith('0x')
  ? PRIVATE_KEY
  : `0x${PRIVATE_KEY}` as `0x${string}`;

// Export other environment variables as needed
export const NODE_ENV = process.env.NODE_ENV || 'development';