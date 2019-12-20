const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      unique: true,
      trim: true,
      maxlength: [40, '10-40 charachters'],
      minlength: [10, '10-40 charachters']
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, 'maxGroupSize is required']
    },
    difficulty: {
      type: String,
      required: [true, 'difficulty is required'],
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'easy, difficult, medium'
      }
    },
    duration: {
      type: Number,
      required: [true, 'duration is required']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, '0-5 '],
      max: [5, '0-5 '],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'price is required']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'discount ({VALUE}) should be less than price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'summary is required']
    },
    imageCover: {
      type: String,
      required: [true, 'summary is required']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});
tourSchema.virtual('reviews', {
  ref: 'Review' /*reference to model  */,
  foreignField:
    'tour' /* the place where current model id is stored in the forigien model   */,
  localField:
    '_id' /* the place where current model id is stored in here, kinda comparison of this 2 fields and to know that this is conected to this one  */
});

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// const testTour = new Tour({ name: 'Xacmaz', rating: 4.7, price: 120 });
// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => console.log('error in saving document', err));
