const mongoose = require('mongoose')

const connect = () => {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected")
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
}

module.exports = connect