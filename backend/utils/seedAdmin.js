const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      await Admin.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      });
      console.log(`✅ Admin seeded — username: "${process.env.ADMIN_USERNAME || 'admin'}"`);
      console.log('⚠️  Change your admin password immediately via the Account tab!');
    }
  } catch (err) {
    console.error('❌ Admin seed failed:', err.message);
  }
};

module.exports = seedAdmin;
