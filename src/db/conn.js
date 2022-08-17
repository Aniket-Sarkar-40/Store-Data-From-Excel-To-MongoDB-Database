const mongoose = require("mongoose");


//connect to db
mongoose.connect("mongodb://localhost:27017/excel_to_mongo",
    { useNewUrlParser: true })
    .then(() => { console.log("Connected to db") })
    .catch((error) => { console.log("error", error) });
