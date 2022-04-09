import slugify from 'slugify'
import Product from '../models/productModel.js'
import FiltersAndSorting from '../utils/filtersAndSorting.js'
import { sampleProductsList } from '../../static/products/products.js'

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

export const getAllProducts = async (req, res) => {
  try {
    const productsQuery = new FiltersAndSorting(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const products = await productsQuery.mongoQueryObj.exec()

    // const products = await Product.find({}, { name: 1, createdAt: 1 })


    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'fail',
      message: error
    })
  }
}

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        product
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

export const createMultipleProducts = async (req, res) => {
  try {
    /* Will add static products list from static file */
    // const products = await Product.insertMany(req.body)
    const products = await Product.insertMany(sampleProductsList)
    res.status(201).json({
      status: 'success',
      count: products.length
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

export const updateProduct = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

export const updateAllProductSlug = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

export const deleteAllProduct = async (req, res) => {
  try {
    console.log("Delete all")
    await Product.deleteMany()
    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

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

export const getAllProductsWithinCategories = async (req, res) => {
  try {
    // TODO
    console.log("getAllProductsWithinCategories")

    res.status(200).json({
      status: 'success',
      message: "Implementation Pending.."
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}

export const getAllCategories = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 'fail',
      message: error
    })
  }
}
