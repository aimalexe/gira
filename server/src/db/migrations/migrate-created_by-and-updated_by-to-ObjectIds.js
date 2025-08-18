const mongoose = require('mongoose');
const User = require('../../models/User.model');

async function migrate() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/gira');

        console.log('Connected to MongoDB');

        const createdRes = await User.updateMany(
            { created_by: { $type: 'string' } },
            [
                {
                    $set: {
                        created_by: { $toObjectId: "$created_by" }
                    }
                }
            ]
        );
        console.log(`Updated created_by for ${createdRes.modifiedCount} users`);

        const updatedRes = await User.updateMany(
            { updated_by: { $type: 'string' } },
            [
                {
                    $set: {
                        updated_by: { $toObjectId: "$updated_by" }
                    }
                }
            ]
        );
        console.log(`Updated updated_by for ${updatedRes.modifiedCount} users`);

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
