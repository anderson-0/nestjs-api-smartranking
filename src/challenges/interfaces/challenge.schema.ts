import mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema({
  dateTimeChallenge: { type: Date, required: true },
  status: { type: String },
  dateTimeRequest: { type: Date },
  dateTimeAnswer: { type: Date },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  category: { type: String },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    }
  ],
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
  }
}, { timestamps: true, collection: 'challenges' });