import { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 4,
  },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
