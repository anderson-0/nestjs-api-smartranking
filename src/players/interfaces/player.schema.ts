import mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  ranking: { type: String },
  rankingPosition: { type: Number },
  urlPhoto: { type: String},
}, { timestamps: true, collection: 'players' });