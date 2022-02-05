import express from 'express'
import { deletePost, getAllPosts, getPost, savePost, updatePost, validateID } from '../controllers/postController.js'

const router = express.Router()

/* 
  Whenever and 'id' will be available in the route, it will call the given middleware
*/
router.param('id', validateID)

router
  .route('/')
  .get(getAllPosts)
  .post(savePost)

router
  .route('/:id')
  .get(getPost)
  .put(updatePost)
  .delete(deletePost)

export default router