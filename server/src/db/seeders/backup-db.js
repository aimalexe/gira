import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { EJSON } from "bson";

// Get CLI args
const args = process.argv.slice(2);
const dbName = args[args.indexOf("-d") + 1] || "gira";
const backupDir = args[args.indexOf("-f") + 1] || "./backup";

const MONGO_URI = `mongodb://localhost:27017/${dbName}`;

async function backupDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`✅ Connected to MongoDB: ${dbName}`);

        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

        const collections = await mongoose.connection.db.listCollections().toArray();

        for (const { name } of collections) {
            const data = await mongoose.connection.db.collection(name).find().toArray();
            fs.writeFileSync(
                path.join(backupDir, `${name}.json`),
                EJSON.stringify(data, null, 2)
            );
            console.log(`📦 Backed up ${name}`);
        }

        console.log(`🎉 Backup completed!\n\t1. DB: ${dbName}, \n\t2. DIR: ${backupDir}`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Backup failed:", err);
        process.exit(1);
    }
}

backupDB();
