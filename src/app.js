const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const XLSX = require("xlsx");
const async = require("async");
const excelModel = require("./models/employee");
require("./db/conn");


//path
const Path = path.join(__dirname, "../public/uploads");

//multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, Path)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });


//init app
const app = express();

//set the template 
app.set("view engine", "hbs");

//fetch the data using request
app.use(bodyParser.urlencoded({ extended: false }));

//static folder path
app.use(express.static(path.resolve(__dirname, '../public')));


app.get("/", (req, res) => {
    excelModel.find((err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (data != '') {
                res.render('home');
            }
            else {
                res.render('home');
            }
        }
    });
});

app.post("/", upload.single('excel'), (req, res) => {
    try {
        var workBook = XLSX.readFile(req.file.path);
        var sheet_nameList = workBook.SheetNames;
        var x = 0;


        var xlData = XLSX.utils.sheet_to_json(workBook.Sheets[sheet_nameList[x]]);

        // xlData.forEach(async (element) => {
        //     try {
        //         const newClient = new excelModel({
        //             name: element['Name of the Candidate'],
        //             phoneNumber: element['Mobile No.'],
        //             Email: element.Email,
        //             DateOfBirth: element['Date of Birth'],
        //             WorkExperience: element['Work Experience'],
        //             ResumeTitle: element['Resume Title'],
        //             CurrLocation: element['Current Location'],
        //             PostalAdd: element['Postal Address'],
        //             CurrentEmployer: element['Current Employer'],
        //             CurrentDesignation: element['Current Designation'],

        //         });

        //         const registerData = await newClient.save();
        //     } catch (error) {
        //         console.log("ERROR",error);
        //     }

        // });




        const Insert = async (element) => {

            //checking duplicate
            const isNewUser = await excelModel.isThisEmailIsValid(element.Email);

            if (isNewUser) {

                try {

                    const newClient = new excelModel({
                        name: element['Name of the Candidate'],
                        phoneNumber: element['Mobile No.'],
                        Email: element.Email,
                        DateOfBirth: element['Date of Birth'],
                        WorkExperience: element['Work Experience'],
                        ResumeTitle: element['Resume Title'],
                        CurrLocation: element['Current Location'],
                        PostalAdd: element['Postal Address'],
                        CurrentEmployer: element['Current Employer'],
                        CurrentDesignation: element['Current Designation'],

                    });

                    const registerData = await newClient.save();
                    // cb(console.log("a"));

                } catch (error) {
                    console.log(error.message);
                }
            }

        };

        //Using async.eachSeries
        async.eachSeries(xlData, Insert)
            .then(() => {
                console.log('All files have been inserted successfully');
            }).catch(err => {
                console.log(err);
            });


    } catch (error) {
        console.log(error);
    }

    res.render("success");
});


const port = process.env.PORT || 3000;

app.listen(port, () => { console.log(`Listening on the port ${port}`) });