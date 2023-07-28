import pg from "pg"
import dotenv from "dotenv"
dotenv.config()

// const connection = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });

const { Pool } = pg

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
};

//if (process.env.MODE_ENV === "production") configDatabase.ssl = true;

export const db = new Pool(configDatabase);