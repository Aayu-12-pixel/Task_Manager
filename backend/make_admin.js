const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const User = require('./models/User');
    
    // We will make the very first user an admin!
    const firstUser = await User.findOne();
    if (firstUser) {
      firstUser.role = 'admin';
      await firstUser.save();
    }
    
    // Fetch all users to display
    const allUsers = await User.find();
    console.log("\n====== YOUR DATABASE USERS ======");
    allUsers.forEach(u => {
      console.log(`Name: ${u.name} | Email: ${u.email} | Role: ${u.role.toUpperCase()}`);
    });
    console.log("=================================\n");

    process.exit(0);
  })
  .catch(err => {
    console.error("DB Error: ", err.message);
    process.exit(1);
  });
