import { DATABASE_NAME } from "@constants/index";

export const get_mongo_connection = () => {
  const db_name = DATABASE_NAME || 'mentorsklub';
  return `${process.env.DATABASE_URI}/${db_name}`;
};
