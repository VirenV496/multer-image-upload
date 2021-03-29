const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const path = require('path');
const fs = require('fs')
// var mongoose = require('mongoose')

const mongodb = require('mongodb');
// require('dotenv/config');


//use of middle 

app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

app.get('/',(req,res)=>{
   res.sendFile(__dirname + '/page.html')
});

//connection
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017'
MongoClient.connect(url, {
    useUnifiedTopology:true,useNewUrlParser:true
},(err,client) =>{
    if(err) return console.log(err);
    db = client.db('images')

    app.listen(5000,()=>{
        console.log('mongo db listenning at 5000')
    })
});



// mongoose.connect(process.env.MONGO_URL,
//     { useNewUrlParser: true, useUnifiedTopology: true }, err => {
//         console.log('connected')
//     });






//local storage for image
var storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'uploads')
    },
    filename:(req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage:storage
})
 
//post update of file 
app.post('/uploadfile', upload.array('myFiles',12), (req,res,next) =>{
    const files = req.files;

       if(!files){
           const error = new Error("please upload a file");
           error.httpstatuscode = 400;
           return next(error)
       }
       res.send(files)
});
 

//upload to db
app.post("/uploadphoto", upload.single('myImage'), (req,res)=>{
    var img = fs.readFileSync(req.file.path);

    var encode_image= img.toString('base64');

    var finalImg ={
        contentType:req.file.mimetype,
        path:req.file.path,
        image:new Buffer(encode_image,'base64')

    };
    db.collection('image').insertOne(finalImg,(err,result)=>{
        console.log(result)
       if(err) return console.log(err);

       console.log("saved to db")

       res.contentType(finalImg.contentType)
       res.send(finalImg.image);

    })
});


//express server
app.listen(3000, () =>{

    console.log("listenning on port 3000..")
})





