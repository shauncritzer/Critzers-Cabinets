import { drizzle } from "drizzle-orm/mysql2";
import { gallery } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const items = await db.select().from(gallery);
console.log(`Total gallery items in database: ${items.length}`);
console.log("\nAll items:");
items.forEach(item => {
  console.log(`ID: ${item.id}, Title: ${item.title}, Image: ${item.imageUrl}`);
});

process.exit(0);
