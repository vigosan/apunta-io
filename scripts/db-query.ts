import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
const r = await sql`SELECT id, name, slug, owner_id, collaborative FROM lists WHERE slug = '100-cosas-para-conocernos'`;
console.log(JSON.stringify(r, null, 2));
