const express = require('express');
const router = express.Router()
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route    GET api/auth
// @desc     Auth route
// @access   Private
router.get('/', auth, async (req, res) => { 
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        res.status(501).send({msg: 'Error in msg'})
    }
    // const {user} = token;
    // console.log(user)
})

module.exports = router;