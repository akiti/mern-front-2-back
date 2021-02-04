const mongoose = require('mongoose')
const config = require('config')

const db = config.get('mongoDB')

const connectDB = async () => {
   try {
    await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    console.log('Mongodb Connected')
   } catch (error) {
       console.error(err.message)
       process.exit(1)
   }
}

module.exports = connectDB;