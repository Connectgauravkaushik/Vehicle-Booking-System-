const mongoose = require('mongoose');

const connectDb = async () => {
    await
        mongoose.connect("mongodb+srv://connectgauravkaushik_db_user:1boPMeSZgSr4wzFT@cluster0.qxnsegn.mongodb.net/")
}

module.exports = connectDb;