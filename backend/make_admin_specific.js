const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const User = require('./models/User');
    
    const emailToPromote = 'aayushagrawal130@gmail.com';
    
    // Promote user
    const newAdmin = await User.findOneAndUpdate(
      { email: emailToPromote }, 
      { $set: { role: 'admin' } },
      { new: true }
    );
    
    if (newAdmin) {
      console.log(`\n✅ SUCCESS! Promoted ${newAdmin.name} (${newAdmin.email}) to ADMIN!\n`);
    } else {
      console.log(`\n❌ ERROR: Could not find user with email ${emailToPromote}. Are you sure they have registered an account?\n`);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error("DB Error: ", err.message);
    process.exit(1);
  });
