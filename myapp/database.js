var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/training';

// To hide warning message about promise
mongoose.Promise = global.Promise;

//Connect Mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', (error) => {
    console.log(error);
});
mongoose.connection.on("connected", () => {
    console.log("Database connected!");
});


module.exports = mongoose;