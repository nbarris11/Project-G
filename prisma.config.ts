import path from "path";
import { defineConfig } from "prisma/config";

const dbPath = path.resolve(__dirname, "prisma/dev.db");

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  datasource: {
    url: `file:${dbPath}`,
  },
  migrate: {
    async adapter() {
      const { PrismaBetterSQLite3 } = await import(
        "@prisma/adapter-better-sqlite3"
      );
      const Database = (await import("better-sqlite3")).default;
      const db = new Database(dbPath);
      return new PrismaBetterSQLite3(db);
    },
  },
});
