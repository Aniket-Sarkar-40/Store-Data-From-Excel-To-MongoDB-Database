const mongoose = require("mongoose");
const validator = require("validator");


//collection schema
const excelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    Email: {
        type : String,
        required : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalide Email.")
            }
        }
    },
    DateOfBirth: {
        type: String,
        required: true,

    },
    WorkExperience: {
        type: String,
        required: true
    },

    ResumeTitle: {
        type: String,
        required: true
    },
    CurrLocation: {
        type: String,
        required: true
    },
    PostalAdd: {
        type: String,
        required: true
    },
    CurrentEmployer: {
        type: String
    },
    CurrentDesignation: {
        type: String
    }
});


excelSchema.statics.isThisEmailIsValid = async function (Email) {
    if(!Email) throw new Error('Invalid Email');
    try {
        const user = await this.findOne({Email});
        if(user) return false;

        return true;
    } catch (error) {
        console.log("Error in the middleware",error.massege);
        return false;
    }
    
}

const excelModel = new mongoose.model('excelData', excelSchema);

module.exports = excelModel;