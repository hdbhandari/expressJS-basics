import slugify from 'slugify'
import Product from '../models/productModel.js'
import FiltersAndSorting from '../utils/filtersAndSorting.js'
import handleAsyncError from '../utils/handleAsyncError.js'
import AppError from '../utils/AppError.js'

export const validateID = (req, res, next, val) => {
  console.log('Value is: ', val)
  if (req.params.id === null || req.params.id === undefined) {
    return res
      .status(404)
      .json({
        'status': 'fail',
        'message': 'Invalid ID'
      })
  }
  next()
}

export const getAllProducts = handleAsyncError(async (req, res, next) => {
  console.log("ok")
  const productsQuery = new FiltersAndSorting(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
  const products = await productsQuery.mongoQueryObj.exec()

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  })
})


export const createProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      product
    }
  })
})

export const createMultipleProducts = handleAsyncError(async (req, res, next) => {
  const products = await Product.insertMany(req.body)
  res.status(201).json({
    status: 'success',
    count: products.length
  })
})

export const getProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  })
})

export const updateProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  })
})

export const deleteProduct = handleAsyncError(async (req, res, next) => {
  console.log("Delete product called")
  const product = await Product.findByIdAndDelete(req.params.id)
  console.log("Delete product called: ", product)
  if (!product) {
    return next(new AppError("No Product Exists to delete", 404))
  }

  res.status(204).json({
    status: 'success',
    data: null
  })
})

export const updateAllProductSlug = handleAsyncError(async (req, res, next) => {
  const products = await Product.find({ slug: "" })
  products.forEach(
    async (product) => {
      await Product.findByIdAndUpdate(product.id, { slug: slugify(product.name, { lower: true }) })
    }
  )

  res.status(200).json({
    status: 'success',
    message: `Total ${products.length} updated`
  })

})

export const deleteAllProduct = handleAsyncError(async (req, res, next) => {
  console.log("Delete all")
  await Product.deleteMany()
  res.status(204).json({
    status: 'success',
    data: null
  })
})

export const top5CheapProducts = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = 'price'
  req.query.fields = 'name,price'
  next()
}

export const top5ExpensiveProducts = (req, res, next) => {
  console.log('top')
  req.query.limit = 5
  req.query.sort = '-price'
  req.query.fields = 'name,price'
  next()
}

export const getAllProductsWithinCategories = handleAsyncError(async (req, res, next) => {
  // TODO
  console.log("getAllProductsWithinCategories")

  res.status(200).json({
    status: 'success',
    message: "Implementation Pending.."
  })
})

export const getAllCategories = handleAsyncError(async (req, res, next) => {
  console.log("getAllCategories")
  // TODO

  /* const categories = await Product.aggregate([
    { $match: { price: { $gte: 21 } } },
    {
      $group: {
        category: { $sum: '$price' }
      }
    }
  ]) */

  res.status(200).json({
    status: 'success',
    message: "Implementation Pending.."
  })
})
