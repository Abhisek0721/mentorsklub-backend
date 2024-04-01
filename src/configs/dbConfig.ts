export const get_mongo_connection = () => {
  const db_name = process.env.DATABASE_NAME || 'mentorsklub';
  return `${process.env.DATABASE_URI}/${db_name}`;
};
