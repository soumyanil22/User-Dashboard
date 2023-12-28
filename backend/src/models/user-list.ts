import mongoose from 'mongoose';

export interface UserList {
  username: string;
  email: string;
  phone: string;
  userId: mongoose.Types.ObjectId;
}

const userListSchema = new mongoose.Schema<UserList>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const UserListModel = mongoose.model('UserList', userListSchema);
