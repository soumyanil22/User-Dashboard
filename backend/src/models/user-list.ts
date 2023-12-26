import mongoose from 'mongoose';

export interface UserList {
  username: string;
  email: string;
  phone: string;
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
  },
  { timestamps: true }
);

export const UserListModel = mongoose.model('UserList', userListSchema);
