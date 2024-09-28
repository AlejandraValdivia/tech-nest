import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String },
		active: { type: Boolean, default: false },
		isAdmin: { type: Boolean, default: false },
		firstLogin: { type: Boolean, default: true },
		googleImage: { type: String, default: undefined },
		googleId: { type: String, default: undefined },
	},
	{ timestamps: true }
);

userSchema.methods.matchPasswords = async function (enteredPassword) {
	console.log('Entered Password:', enteredPassword);  // Log the entered password
	console.log('Stored Password:', this.password);     // Log the stored password in the database
	return await bcrypt.compare(enteredPassword, this.password);
  };
  

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
