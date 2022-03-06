if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = 3000

// use body-parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

// use cors
app.use(cors())

// route app using ./routes
require('./routes')(app)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})