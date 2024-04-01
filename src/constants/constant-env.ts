export const ConstantEnv = {
  PORT: process.env.PORT || 3000,

  DATABASE_NAME: process.env.DATABASE_NAME || 'mentorsklub',

  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  JWT_SECRET: process.env.JWT_SECRET,

  JWT_EXPIRY_TIME: process.env.JWT_EXPIRY_TIME || '2days',
};
