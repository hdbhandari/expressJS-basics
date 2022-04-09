import mongoose from 'mongoose'
import slugify from 'slugify'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    unique: true,
    trim: true,
    maxlength: [80, 'Product name cannot be more than 80 Characters'],
    minlength: [2, 'Product name cannot be less than 2 Characters']
  },
  type: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['bakery', 'dairy', 'fruit', 'vegan', 'meat'],
      message: 'Type {VALUE} is not allowed, it can be one of these: bakery, dairy, fruit, vegan, meat'
    }
  },
  slug: {
    type: String,
    default: ""
  },
  availableQuantity: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    max: [5, 'Max rating is 5']
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    trim: true
  },
  launchDate: {
    type: Date,
    default: Date.now(),
    select: true // It will come in find queries, unless we specify not to select it
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false // By default, it will not come in find queries 
  },
  active: {
    type: Boolean,
    default: true
  },
  filename: {
    type: String,
    trim: true,
  },
  height: Number,
  width: Number,
  discountAmount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price
      },
      message: 'Discount price ({VALUE}) should be below price'
    }
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

productSchema.virtual('howOld').get(function () {
  return (new Date() - this.launchDate)
})

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

productSchema.pre('insertMany', function (next) {
  console.log("Pre insertMany")
  /* NOTE: In case of insertMany, slugs are not added - may be this is the expected behaviour(not sure) */
  this.slug = slugify(this.name, { lower: true })
  next()
})

productSchema.post('save', function (doc, next) {
  console.log('🔗 I am post save hook, Product saved')
  next()
})

/* all starting with *find, using regular expression */
productSchema.pre(/^find/, function (next) {
  this.start = Date.now()
  next()
})

productSchema.post(/^find/, function (docs, next) {
  console.log(`🔗 Mongoose query completed in ${new Date() - this.start} ms`)
  next()
})

productSchema.pre('aggregate', function (next) {
  //this.pipeline().unshift(#match)
})

const Product = mongoose.model('Product', productSchema)
export default Product