const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const User = require('./models/User');
    const Task = require('./models/Task');
    
    const emailToDelete = 'aayushagrawal11082004@gmail.com';
    
    const user = await User.findOne({ email: emailToDelete });
    
    if (user) {
      // Delete all tasks associated with the user
      const deletedTasks = await Task.deleteMany({ user: user._id });
      // Delete the user
      await User.deleteOne({ _id: user._id });
      console.log(`\n🗑️ SUCCESS: Safely deleted user ${emailToDelete} and their ${deletedTasks.deletedCount} tasks.\n`);
    } else {
      console.log(`\n❌ ERROR: Could not find user with email ${emailToDelete}.\n`);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error("DB Error: ", err.message);
    process.exit(1);
  });
