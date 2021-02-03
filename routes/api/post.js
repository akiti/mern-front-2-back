const express = require('express')
const auth = require('../../middleware/auth');

const router = express.Router()

// @route    GET api/post
// @desc     Post route
// @access   Public
router.get('/',auth, (req, res) => res.send('Post  route'))



module.exports = router;