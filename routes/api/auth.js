const express = require('express');
const router = express.Router()
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')

// @route    GET api/auth
// @desc     Auth route
// @access   Private
router.get('/', async (req, res) => { 
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        res.status(501).send({msg: 'Error in msg'})
    }
})


router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password','Password is required').exists(),
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // find the information we want to save about user
    const {email, password}  = req.body;
    try {
        // see if user is not already in database
        let user = await User.findOne({email})
        if (!user) {
            res.status(400).json({errors: [{  msg: 'Invalid Credentials'}]})
        } 
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).json({errors: [{  msg: 'Invalid Credentials'}]})
        }
        const payload = {
            user : {
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jsonKey'),{expiresIn: 360000}, (err, token) => {
            if (err) throw err;
            res.json({token})
        })
       } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
    // console.log(req.body)
})

module.exports = router; 