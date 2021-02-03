// const router = require('express').Router;
const express = require('express')
const gravatar = require('gravatar')
var bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../../models/User')
const config = require('config')

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min: 6}),
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // find the information we want to save about user
    const {name, email, password}  = req.body;
    try {
        // see if user is not already in database
        let user = await User.findOne({email})
        if (user) {
            res.status(400).json({errors: [{  msg: 'User already in database'}]})
        } 
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        // create the user
        user = new User({name, email, password, avatar})
        // hash user password
        var salt = bcrypt.genSaltSync(10);
        user.password = await bcrypt.hash(password, salt)
        await user.save()
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
        res.status(500).send('Server error')
    }
    // console.log(req.body)
})

module.exports = router;