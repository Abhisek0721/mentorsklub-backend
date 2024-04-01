export const get_mongo_connection = () => {
  const db_name = process.env.DATABASE_NAME || 'mentorsklub';
  console.log(`${process.env.DATABASE_URI}/${db_name}`)
  return `${process.env.DATABASE_URI}/${db_name}`;
};
