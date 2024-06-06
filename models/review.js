// models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  mediaType: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Review  = mongoose.model('Review', ReviewSchema);

module.exports = Review;


