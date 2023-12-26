import mongoose from 'mongoose';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Others = 'others',
}

export enum ReferralSource {
  LinkedIn = 'linkedin',
  Friends = 'friends',
  JobPortal = 'job-portal',
  Others = 'others',
}

export enum City {
  Mumbai = 'mumbai',
  Pune = 'pune',
  Ahmedabad = 'ahmedabad',
  Bengaluru = 'bengaluru',
}

export enum State {
  Gujarat = 'gujarat',
  Maharashtra = 'maharashtra',
  Karnataka = 'karnataka',
}

export interface User {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  referralSource: ReferralSource;
  city: City;
  state: State;
  password: string;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: {
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
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'others'],
    },
    referralSource: {
      type: String,
      required: false,
      enum: ['linkedin', 'friends', 'job-portal', 'others'],
    },
    city: {
      type: String,
      required: true,
      enum: ['mumbai', 'pune', 'ahmedabad', 'bengaluru'],
    },
    state: {
      type: String,
      required: true,
      enum: ['gujrat', 'maharashtra', 'karnataka'],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);
