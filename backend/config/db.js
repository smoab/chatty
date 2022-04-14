const mongoose = require('mongoose')

const connectToDB = async () => {
    try {
        const DBConnection = await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`Successfully connected to DB: ${DBConnection.connection.host} ✔`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit()
    }
}

module.exports = connectToDB