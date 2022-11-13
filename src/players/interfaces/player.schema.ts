import mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  ranking: { type: String, required: true },
  rankingPosition: { type: Number, required: true },
  urlPhoto: { type: String, required: true },
}, { timestamps: true, collection: 'players' });