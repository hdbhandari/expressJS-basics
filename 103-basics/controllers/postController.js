export const validateID = (req, res, next, val) => {
  console.log('Value is: ', val)

  /* 
    Just to show that validation is working fine, null is passed as string here
    So, while making req, endpoint will contain :id as string null
  */
  if (req.params.id === 'null' || req.params.id === undefined) {
    return res
      .status(404)
      .json({
        'status': 'fail',
        'message': 'Invalid ID'
      })
  }
  next()
}

export const getAllPosts = (req, res) => {
  res.json({ 'status': 'success', 'count': 0, 'data': { 'posts': [] } })
}

export const savePost = (req, res) => {
  res.json({ 'req_body': `savePost called with Body: ${JSON.stringify(req.body)}` })
}

export const getPost = (req, res) => {
  res.json({ 'req_param_id': `Get post with ID of: ${req.params.id}` })
}

export const updatePost = (req, res) => {
  const id = +req.params.id
  const body = req.body
  res.json({ 'req_param_id': id, 'req_body': body })
}

export const deletePost = (req, res) => {
  const id = +req.params.id
  res.json({ 'req_param_id': id })
}