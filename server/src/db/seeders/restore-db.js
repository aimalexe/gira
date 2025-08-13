import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { EJSON } from "bson";

// Get CLI args
const args = process.argv.slice(2);
const dbName = args[args.indexOf("-d") + 1] || "gira_backup";
const backupDir = args[args.indexOf("-f") + 1] || "./backup";

const MONGO_URI = `mongodb://localhost:27017/${dbName}`;

async function restoreDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`✅ Connected to MongoDB: ${dbName}`);

        const files = fs.readdirSync(backupDir);

        for (const file of files) {
            const collectionName = file.replace(".json", "");
            const rawData = fs.readFileSync(path.join(backupDir, file), "utf-8");
            const data = EJSON.parse(rawData);

            if (data.length > 0) {
                await mongoose.connection.db.collection(collectionName).deleteMany({});
                await mongoose.connection.db.collection(collectionName).insertMany(data);
                console.log(`♻ Restored ${collectionName}`);
            }
        }

        console.log(`🎉 Restore completed!\n\t1. DB: ${dbName}, \n\t2. DIR: ${backupDir}`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Restore failed:", err);
        process.exit(1);
    }
}

restoreDB();
