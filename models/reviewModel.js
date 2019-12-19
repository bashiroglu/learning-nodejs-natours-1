const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review is required']
    },

    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: [
      /* reference to tour */
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'review have to have tour']
      }
    ],
    user: [
      /* reference to user */
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review have to have user']
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
