import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const { ObjectId } = Schema.Types;

const FileSchema = new Schema({
  createdAt: { type: Date },
  expiresAt: { type: Date },
  updatedAt: { type: Date },
  name: { type: String, required: true },
  s3Url: { type: String },
  s3Filename: { type: String },
  size: { type: Number, required: true },
  password: String,
  from: { type: ObjectId, ref: 'User' },
  to: [{ type: ObjectId, ref: 'User' }],
  senderDevice: { type: String },
  type: { type: String },
  isGroup: { type: Boolean, default: false },
  remainingExpiryMods: { type: String, default: 2 },
  linkSlug: { type: String, default: '' }
});

FileSchema.pre('save', function preSave(next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    // this.expiresAt = now.setDate(now.getDate() + 1);
    this.createdAt = now;
  }
  next();
});

FileSchema.methods.comparePassword = function compare(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) reject(err);
      resolve(isMatch);
    });
  });
};

export default mongoose.model('File', FileSchema);
