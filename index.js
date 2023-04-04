const PORT = require('./utils/config').PORT
const app = require('./app')

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})