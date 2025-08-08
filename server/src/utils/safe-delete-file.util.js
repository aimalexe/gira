const fs = require("node:fs/promises");
const path = require("node:path");

async function safeDelete(filePath) {
    if (filePath === "") return
    try {
        const fullPath = path.join(process.cwd(), filePath)
        await fs.access(fullPath);
        await fs.unlink(fullPath);
        console.log("Deleted old file:", fullPath);
    } catch (err) {
        if (err.code === "ENOENT") {
            console.warn("File not found, skipping delete:", filePath);
        } else {
            console.error("Error deleting file:", err);
        }
    }
}

module.exports = {
    safeDelete
}