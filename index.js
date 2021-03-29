 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
 
var fs = require('fs');
var path = require('path');
require('dotenv/config');
 
var multer = require('multer');

var imgModel = require('./model');


//for connection
mongoose.connect(process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }, err => {
      console.log('connected to mongodb server')
  });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
/* app.set("view engine", "ejs");  */

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
 });



//Step 5 - set up multer for storing uploaded files
 
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });




// app.get('/', (req, res) => {
//     imgModel.find({}, (err, items) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error occurred', err);
//         }
//         else {
//             res.render('index', { items: items });
//         }
//     });
// });


// Step 8 - the POST handler for processing the uploaded file  'image'

app.post('/upload', upload.single('image'), (req, res, next) => {
       
	var obj = {
		// name: req.body.name,
	 	// desc: req.body.desc, 
		img: {
			data: fs.readFileSync(path.join(__dirname + '/uploads' + req.file.filename)),
			contentType: 'image/png'
		}
	}
    //for saving data to db
	imgModel.create(obj, (err, item) => {
        console.log(item)
		if (err) {
			console.log(err);
		}
		else {
	     item.save();
			res.redirect('/');
			console.log('saved')
		}
	});
});


// Step 9 - configure the server's port

var port = process.env.PORT || '3000'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port...', port)
});
 
