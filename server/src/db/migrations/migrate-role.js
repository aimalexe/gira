const mongoose = require('mongoose');
const User = require('../../models/User.model');

const ADMIN_ROLE_ID = new mongoose.Types.ObjectId('689b198d653e6183aa80352d');
const USER_ROLE_ID = new mongoose.Types.ObjectId('689b1fae5dec4578718b89ae');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gira');

        // Use raw collection to avoid ObjectId casting on filter
        const adminUpdate = await User.collection.updateMany(
            { role: 'admin' }, // matches old string values
            { $set: { role: ADMIN_ROLE_ID } }
        );

        const userUpdate = await User.collection.updateMany(
            { role: 'user' },
            { $set: { role: USER_ROLE_ID } }
        );

        console.log(`✅ Admin roles updated: ${adminUpdate.modifiedCount}`);
        console.log(`✅ User roles updated: ${userUpdate.modifiedCount}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
})();
