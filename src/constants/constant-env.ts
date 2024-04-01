export const ConstantEnv = {
  PORT: process.env.PORT || 3000,

  DATABASE_URI: process.env.DATABASE_URI ||
    'mongodb+srv://abhisekupa:uQIXMDQQjK0I9TFl@mentorsklub.ikrm1tt.mongodb.net',

  DATABASE_NAME: process.env.DATABASE_NAME || 'mentorsklub',

  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 
    'bbdf2ae7c032d53b762de0999758e7c39a88683ce2d4d78653a1a648997262129',

  JWT_SECRET: process.env.JWT_SECRET || '4226452948404Ds63omp5166546A576E5A723475377vgds',

  JWT_EXPIRY_TIME: process.env.JWT_EXPIRY_TIME || '2days',
};
