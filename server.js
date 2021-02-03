const express = require('express')
const connectDB = require('./config/db')
const app = express()


// connecting to database
connectDB()

app.use(express.json({extended: false}))

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/post'))

app.get('/', (req, res) => {
    res.json({message: 'Able to get slash'})
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is listening on Port ${port}`)
})