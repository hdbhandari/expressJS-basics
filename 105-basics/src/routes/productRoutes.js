import express from 'express'
import {
  deleteProduct,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  validateID,
  createMultipleProducts,
  updateAllProductSlug,
  deleteAllProduct,
  top5ExpensiveProducts,
  top5CheapProducts,
  getAllCategories,
  getAllProductsWithinCategories
} from '../controllers/ProductController.js'

const router = express.Router()

/* 
  Whenever and 'id' will be available in the route, it will call the given middleware
*/
router.param('id', validateID)

/* 
  Location of below 2 routes "/top-5-cheap-products" and "/top-5-expensive-products"
  is important, as if these goes after remaining routes, it will throw error
  TODO: Why so? still needs to find.
*/
router
  .route('/top-5-cheap-products')
  .get(top5CheapProducts, getAllProducts)

router
  .route('/top-5-expensive-products')
  .get(top5ExpensiveProducts, getAllProducts)

router
  .route('/get-all-categories')
  .get(getAllCategories)

router
  .route('/get-all-products-by-category')
  .get(getAllProductsWithinCategories)

router
  .route('/')
  .get(getAllProducts)
  .post(createProduct)

router
  .route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct)

router.route('/util/addMultipleProducts').post(createMultipleProducts)
router.route('/util/addMissingProductSlug').patch(updateAllProductSlug)
router.route('/util/deleteAllProducts').delete(deleteAllProduct)

export default router