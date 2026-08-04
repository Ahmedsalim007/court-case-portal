import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(

  {
    fullName:{
      type: String, 
      required:true,
      trim:true,
      match: [/^[A-Za-z\s.\-']+$/, 'Full name must contain only letters'],

    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{1,6}$/, 'Employee ID must be 1 to 6 digits'],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['Clerk'],
        message: '{VALUE} is not a valid role',
      },
      default: 'Clerk',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model('User', userSchema);