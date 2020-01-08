var express = require("express");
const mongodb = require("mongodb");
const Busboy = require("busboy");
const mime = require('mime-types');

mongodb.connect("mongodb://localhost:31001",(err,client)=>{
    if(err){
        console.log(err);
        process.exit(1);
    } else {
        console.log("Successfully connected to the database");
        let db = client.db("eigen_files");
        let bucket = new mongodb.GridFSBucket(db);
        var app = express();
        app.get('/', function(req,res) {
            res.json({});
        })
        app.get('/download/:filename',(req,res) => {
            res.set('Content-Type',mime.lookup(req.param.filename));
            bucket.openDownloadStreamByName(req.params.filename).pipe(res);
        });

        app.post('/upload',(req,res) => {
            var busboy = new Busboy({ headers: req.headers});
            busboy.on("file",(fieldname,file,filename,encoding,mimetype) => {
                file.pipe(bucket.openUploadStream(filename));
            });

            busboy.on("field", (fieldname,val,fieldNameTruncated,valTruncated,mimetype) => {
                // console.log(fieldname);
            });

            busboy.on("finish",() => {
                console.log("done parsing form");
                res.json({
                    status:"success",
                    message:"File uploaded successfully"
                });
            });

            req.pipe(busboy);
        });

        app.listen(5000,"0.0.0.0",()=>{
            console.log("server startde running on port 6000");
        });

        // create an ipc interface toupload file
    }
});